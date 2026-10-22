/** Shared USI analytics policy. Keep identical across the six sites. */
export function journeyScript(host: string, site: string, production: boolean): string {
  return String.raw`(function(w,d){
    if(w.__usiJourneyInstalled)return;
    w.__usiJourneyInstalled=true;
    var u=new URL(w.location.href), host=${JSON.stringify(host)}, site=${JSON.stringify(site)};
    var cookie='usi_analytics_test';
    var owned=/^(?:united-studio\.com|(?:rec|studio|utattemita|yosakoi|reserve)\.united-studio\.com)$/.test(u.hostname);
    if(owned && u.protocol==='https:' && ['0','1'].indexOf(u.searchParams.get(cookie))>=0){
      d.cookie=cookie+'='+u.searchParams.get(cookie)+'; Domain=united-studio.com; Path=/; Max-Age='+(u.searchParams.get(cookie)==='1'?'86400':'0')+'; Secure; SameSite=Lax';
    }
    function allowed(){
      try{
        var current=new URL(w.location.href);
        return ${JSON.stringify(production)} && current.hostname===host && current.protocol==='https:' &&
          current.searchParams.get(cookie)!=='1' && !/(?:^|;\s*)usi_analytics_test=1(?:;|$)/.test(d.cookie) &&
          !/^\/(admin|auth)(?:\/|$)/.test(current.pathname) &&
          ![...current.searchParams.keys(),...new URLSearchParams(current.hash.slice(1)).keys()].some(function(k){return /^(token_hash|access_token|refresh_token|code|state|token|id_token)$/i.test(k);});
      }catch(e){return false;}
    }
    w.__usiAnalyticsAllowed=allowed;
    if(!allowed())w['ga-disable-G-PPENCNYR54']=true;
    w.__usiTrack=function(name,params){
      if(!allowed())return;
      w.dataLayer=w.dataLayer||[];
      function gtag(){w.dataLayer.push(arguments);}
      gtag('event',name,Object.assign({send_to:'G-PPENCNYR54'},params));
    };
    if(site==='reserve' && allowed()){
      try{
        var login=Number(w.sessionStorage.getItem('usi-login-event:v1'));
        w.sessionStorage.removeItem('usi-login-event:v1');
        if(login>0 && Date.now()-login>=0 && Date.now()-login<300000)w.__usiTrack('login',{method:'email'});
      }catch(e){}
    }
    var last='',lastTime=0;
    d.addEventListener('click',function(e){
      try{
        if(!allowed() || !(e.target instanceof Element))return;
        var a=e.target.closest('a[href]');if(!a)return;
        var to=new URL(a.href,w.location.href);
        if(to.hostname!=='reserve.united-studio.com'||to.protocol!=='https:'||!/^\/(?:book|auth\/(?:login|sign-up))?\/?$/.test(to.pathname))return;
        var pos=a.getAttribute('data-booking-position');
        if(['hero','header','content','footer','sticky'].indexOf(pos)<0)pos=a.closest('header')?'header':a.closest('footer')?'footer':'content';
        var page=w.location.pathname;
        if(!/^\/(?:[a-z-]+\/)*[a-z-]*$/.test(page))page='/other';
        var key=page+':'+pos+':'+to.pathname,now=Date.now();
        if(key===last&&now-lastTime<1000)return;last=key;lastTime=now;
        w.__usiTrack(site==='reserve'?'booking_entry_click':'booking_link_click',{
          source_site:site,source_page:page,link_position:pos
        });
      }catch(e){}
    },true);
  })(window,document);`
}
