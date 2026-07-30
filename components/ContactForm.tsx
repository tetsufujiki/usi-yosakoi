"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  contactInquiryTypes,
  contactLimits,
  isContactEmail,
  isContactInquiryType,
  type ContactFieldErrors,
} from "@/lib/contact";

type FormStatus = "idle" | "submitting" | "success" | "error";

function fieldValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export function ContactForm() {
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: ContactFieldErrors = {};
    const teamName = fieldValue(formData, "teamName");
    const contactName = fieldValue(formData, "contactName");
    const email = fieldValue(formData, "email");
    const location = fieldValue(formData, "location");
    const role = fieldValue(formData, "role");
    const performanceYear = fieldValue(formData, "performanceYear");
    const audioDeadline = fieldValue(formData, "audioDeadline");
    const inquiryType = fieldValue(formData, "inquiryType");
    const message = fieldValue(formData, "message");
    const notes = fieldValue(formData, "notes");
    const website = fieldValue(formData, "website");

    if (!teamName) nextErrors.teamName = "チーム名を入力してください。";
    else if (teamName.length > contactLimits.teamName)
      nextErrors.teamName = `${contactLimits.teamName}文字以内で入力してください。`;
    if (!contactName)
      nextErrors.contactName = "ご担当者名を入力してください。";
    else if (contactName.length > contactLimits.contactName)
      nextErrors.contactName = `${contactLimits.contactName}文字以内で入力してください。`;
    if (!email) {
      nextErrors.email = "メールアドレスを入力してください。";
    } else if (!isContactEmail(email)) {
      nextErrors.email = "メールアドレスの形式を確認してください。";
    }
    if (location.length > contactLimits.location)
      nextErrors.location = `${contactLimits.location}文字以内で入力してください。`;
    if (role.length > contactLimits.role)
      nextErrors.role = `${contactLimits.role}文字以内で入力してください。`;
    if (!performanceYear)
      nextErrors.performanceYear = "演舞予定年度を入力してください。";
    else if (performanceYear.length > contactLimits.performanceYear)
      nextErrors.performanceYear = `${contactLimits.performanceYear}文字以内で入力してください。`;
    if (!audioDeadline)
      nextErrors.audioDeadline = "音源が必要な時期を入力してください。";
    else if (audioDeadline.length > contactLimits.audioDeadline)
      nextErrors.audioDeadline = `${contactLimits.audioDeadline}文字以内で入力してください。`;
    if (!isContactInquiryType(inquiryType))
      nextErrors.inquiryType = "ご相談内容を選択してください。";
    if (!message) {
      nextErrors.message = "ご相談内容を入力してください。";
    } else if (message.length < contactLimits.messageMinimum) {
      nextErrors.message = `ご相談内容を${contactLimits.messageMinimum}文字以上で入力してください。`;
    } else if (message.length > contactLimits.message) {
      nextErrors.message = `${contactLimits.message}文字以内で入力してください。`;
    }
    if (notes.length > contactLimits.notes)
      nextErrors.notes = `${contactLimits.notes}文字以内で入力してください。`;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          contactName,
          email,
          location,
          role,
          performanceYear,
          audioDeadline,
          inquiryType,
          message,
          notes,
          website,
          startedAt: startedAtRef.current,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        fieldErrors?: ContactFieldErrors;
      } | null;

      if (!response.ok || !result?.ok) {
        if (result?.fieldErrors) setErrors(result.fieldErrors);
        setStatus("error");
        return;
      }

      form.reset();
      startedAtRef.current = Date.now();
      setErrors({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Webサイト</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="contact-form__grid">
        <FormField
          id="contact-team"
          label="チーム名"
          name="teamName"
          required
          maxLength={contactLimits.teamName}
          error={errors.teamName}
        />
        <FormField
          id="contact-name"
          label="ご担当者名"
          name="contactName"
          autoComplete="name"
          required
          maxLength={contactLimits.contactName}
          error={errors.contactName}
        />
        <FormField
          id="contact-email"
          label="メールアドレス"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={contactLimits.email}
          error={errors.email}
        />
        <FormField
          id="contact-location"
          label="所在地"
          name="location"
          autoComplete="address-level1"
          maxLength={contactLimits.location}
          error={errors.location}
        />
        <FormField
          id="contact-role"
          label="お役目"
          name="role"
          placeholder="例：代表、楽曲担当"
          maxLength={contactLimits.role}
          error={errors.role}
        />
        <FormField
          id="contact-year"
          label="演舞予定年度"
          name="performanceYear"
          inputMode="numeric"
          placeholder="例：2027"
          required
          maxLength={contactLimits.performanceYear}
          error={errors.performanceYear}
        />
        <FormField
          id="contact-deadline"
          label="音源が必要な時期"
          name="audioDeadline"
          placeholder="例：2027年3月頃"
          required
          maxLength={contactLimits.audioDeadline}
          error={errors.audioDeadline}
        />

        <label className="contact-field">
          <span>
            ご相談内容 <em>必須</em>
          </span>
          <select
            id="contact-inquiry"
            name="inquiryType"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.inquiryType)}
            aria-describedby={
              errors.inquiryType ? "contact-inquiry-error" : undefined
            }
          >
            <option value="" disabled>
              選択してください
            </option>
            {contactInquiryTypes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {errors.inquiryType ? (
            <small id="contact-inquiry-error">{errors.inquiryType}</small>
          ) : null}
        </label>

        <label
          className="contact-field contact-field--full"
          htmlFor="contact-message"
        >
          <span>
            ご相談内容の詳細 <em>必須</em>
          </span>
          <textarea
            id="contact-message"
            name="message"
            rows={7}
            required
            minLength={contactLimits.messageMinimum}
            maxLength={contactLimits.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            placeholder="現在決まっている演舞内容のほか、チームの現在の活動状況やチームカラーなど、できるだけ詳しい情報をお知らせください。"
          />
          {errors.message ? (
            <small id="contact-message-error">{errors.message}</small>
          ) : null}
        </label>

        <label
          className="contact-field contact-field--full"
          htmlFor="contact-notes"
        >
          <span>メモ</span>
          <textarea
            id="contact-notes"
            name="notes"
            rows={3}
            maxLength={contactLimits.notes}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={
              errors.notes ? "contact-notes-error" : undefined
            }
          />
          {errors.notes ? (
            <small id="contact-notes-error">{errors.notes}</small>
          ) : null}
        </label>
      </div>

      <div className="contact-form__submit">
        <p>
          内容を確認のうえ、返信いたします。制作時期や内容によっては、
          ご希望に添えない場合があります。
        </p>
        <p>
          料金の確認のみを目的としたお問い合わせや、相見積もりを主な目的とするお問い合わせにつきましては、
          回答を控えさせていただく場合がございます。
        </p>
        <button type="submit" disabled={status === "submitting"}>
          <span className="contact-form__submit-label">
            {status === "submitting"
              ? "送信中です"
              : "制作希望の内容を送る"}
          </span>
          <span aria-hidden="true">→</span>
        </button>
        <div
          className="contact-form__status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status === "success" ? (
            <div className="contact-form__message">
              <p>お問い合わせを受け付けました。</p>
              <p>内容を確認のうえ、返信いたします。</p>
            </div>
          ) : null}
          {status === "error" ? (
            <div className="contact-form__message" role="alert">
              <p>送信できませんでした。</p>
              <p>時間をおいて、もう一度お試しください。</p>
            </div>
          ) : null}
        </div>
      </div>
    </form>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  error?: string;
  full?: boolean;
};

function FormField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  required,
  maxLength,
  error,
  full,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <label
      className={`contact-field${full ? " contact-field--full" : ""}`}
      htmlFor={id}
    >
      <span>
        {label} {required ? <em>必須</em> : null}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? <small id={errorId}>{error}</small> : null}
    </label>
  );
}
