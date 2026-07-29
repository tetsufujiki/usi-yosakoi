import { NextResponse } from "next/server";

import {
  contactLimits,
  isContactEmail,
  isContactInquiryType,
  type ContactFieldErrors,
} from "@/lib/contact";

const DEFAULT_CONTACT_TO_EMAIL = "info@united-studio.com";
const MINIMUM_COMPLETION_MS = 1500;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const recentRequests = new Map<string, number[]>();

type ContactPayload = {
  teamName: string;
  contactName: string;
  email: string;
  location: string;
  role: string;
  performanceYear: string;
  audioDeadline: string;
  inquiryType: string;
  message: string;
  notes: string;
  website: string;
  startedAt: number;
};

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parsePayload(value: unknown): ContactPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const body = value as Record<string, unknown>;
  return {
    teamName: stringValue(body.teamName),
    contactName: stringValue(body.contactName),
    email: stringValue(body.email),
    location: stringValue(body.location),
    role: stringValue(body.role),
    performanceYear: stringValue(body.performanceYear),
    audioDeadline: stringValue(body.audioDeadline),
    inquiryType: stringValue(body.inquiryType),
    message: stringValue(body.message),
    notes: stringValue(body.notes),
    website: stringValue(body.website),
    startedAt:
      typeof body.startedAt === "number" ? body.startedAt : Number.NaN,
  };
}

function validate(payload: ContactPayload): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!payload.teamName) {
    errors.teamName = "チーム名を入力してください。";
  } else if (payload.teamName.length > contactLimits.teamName) {
    errors.teamName = `${contactLimits.teamName}文字以内で入力してください。`;
  }

  if (!payload.contactName) {
    errors.contactName = "ご担当者名を入力してください。";
  } else if (payload.contactName.length > contactLimits.contactName) {
    errors.contactName = `${contactLimits.contactName}文字以内で入力してください。`;
  }

  if (!payload.email) {
    errors.email = "メールアドレスを入力してください。";
  } else if (!isContactEmail(payload.email)) {
    errors.email = "メールアドレスの形式を確認してください。";
  }

  if (!payload.performanceYear) {
    errors.performanceYear = "演舞予定年度を入力してください。";
  } else if (
    payload.performanceYear.length > contactLimits.performanceYear
  ) {
    errors.performanceYear = `${contactLimits.performanceYear}文字以内で入力してください。`;
  }

  if (!payload.audioDeadline) {
    errors.audioDeadline = "音源が必要な時期を入力してください。";
  } else if (payload.audioDeadline.length > contactLimits.audioDeadline) {
    errors.audioDeadline = `${contactLimits.audioDeadline}文字以内で入力してください。`;
  }

  if (!isContactInquiryType(payload.inquiryType)) {
    errors.inquiryType = "ご相談内容を選択してください。";
  }

  if (!payload.message) {
    errors.message = "ご相談内容を入力してください。";
  } else if (payload.message.length < contactLimits.messageMinimum) {
    errors.message = `ご相談内容を${contactLimits.messageMinimum}文字以上で入力してください。`;
  } else if (payload.message.length > contactLimits.message) {
    errors.message = `${contactLimits.message}文字以内で入力してください。`;
  }

  if (payload.location.length > contactLimits.location) {
    errors.location = `${contactLimits.location}文字以内で入力してください。`;
  }

  if (payload.role.length > contactLimits.role) {
    errors.role = `${contactLimits.role}文字以内で入力してください。`;
  }

  if (payload.notes.length > contactLimits.notes) {
    errors.notes = `${contactLimits.notes}文字以内で入力してください。`;
  }

  return errors;
}

function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(address: string, now: number): boolean {
  const active = (recentRequests.get(address) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (active.length >= RATE_LIMIT_MAX_REQUESTS) {
    recentRequests.set(address, active);
    return true;
  }

  active.push(now);
  recentRequests.set(address, active);
  return false;
}

function safeSubjectPart(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 100);
}

function optionalValue(value: string): string {
  return value || "未入力";
}

function formatEmailBody(
  payload: ContactPayload,
  sentAt: Date,
  sourceUrl: string,
): string {
  const timestamp = new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "long",
    timeStyle: "medium",
    timeZone: "Asia/Tokyo",
  }).format(sentAt);

  return [
    "よさこい楽曲制作サイトからお問い合わせが届きました。",
    "",
    `チーム名：${payload.teamName}`,
    `ご担当者名：${payload.contactName}`,
    `メールアドレス：${payload.email}`,
    `所在地：${optionalValue(payload.location)}`,
    `お役目：${optionalValue(payload.role)}`,
    `演舞予定年度：${payload.performanceYear}`,
    `音源が必要な時期：${payload.audioDeadline}`,
    `ご相談内容：${payload.inquiryType}`,
    "",
    "ご相談内容の詳細：",
    payload.message,
    "",
    "メモ：",
    optionalValue(payload.notes),
    "",
    `送信日時：${timestamp}`,
    `送信元ページ：${sourceUrl}`,
  ].join("\n");
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const requestOrigin = request.headers.get("origin");

  if (requestOrigin && requestOrigin !== requestUrl.origin) {
    return json({ ok: false }, 403);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false }, 415);
  }

  let payload: ContactPayload | null = null;
  try {
    payload = parsePayload(await request.json());
  } catch {
    return json({ ok: false }, 400);
  }

  if (!payload) return json({ ok: false }, 400);

  const now = Date.now();
  if (
    payload.website ||
    !Number.isFinite(payload.startedAt) ||
    payload.startedAt <= 0 ||
    now - payload.startedAt < MINIMUM_COMPLETION_MS
  ) {
    return json({ ok: false }, 400);
  }

  const fieldErrors = validate(payload);
  if (Object.keys(fieldErrors).length > 0) {
    return json({ ok: false, fieldErrors }, 422);
  }

  if (isRateLimited(clientAddress(request), now)) {
    return json({ ok: false }, 429);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_TO_EMAIL;

  if (!apiKey || !from) {
    console.error("[contact] Email configuration is incomplete.", {
      hasApiKey: Boolean(apiKey),
      hasFromAddress: Boolean(from),
    });
    return json({ ok: false }, 503);
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `【よさこい楽曲制作 お問い合わせ】${safeSubjectPart(payload.teamName)}｜${safeSubjectPart(payload.contactName)}`,
        text: formatEmailBody(
          payload,
          new Date(now),
          `${requestUrl.origin}/contact`,
        ),
      }),
    });
  } catch {
    console.error("[contact] Resend request failed before receiving a response.");
    return json({ ok: false }, 502);
  }

  if (!response.ok) {
    console.error("[contact] Resend rejected the email request.", {
      status: response.status,
    });
    return json({ ok: false }, 502);
  }

  return json({ ok: true });
}
