// (c) AuthPro Forms JS v1.0

var fn=document.currentScript.getAttribute('form');
if (fn == null) { fn='aform'; } 
var af=document.forms[fn];

if (typeof af == 'undefined') throw new Error("Can't locate AuthPro form: "+fn);

if (af.action.value=='reg2') {
  let r=document.URL.match(/aprid=(\w+)/);
  if ((r!=null)&&(typeof(af.aprid)=='undefined')) {
    let h = document.createElement("input"); h.setAttribute("type", "hidden"); h.setAttribute("name", "aprid"); h.setAttribute("value", +r[1]); af.appendChild(h);
    console.log('Add aprid='+r[1]);
  }
}

//alert (af.onsubmit);

if (af.onsubmit==null) {
  af.onsubmit = async (e) => {
    e.preventDefault();
    	//async function ap_form_submit(af) {
    	//alert(af);
    	//var af=af;
    	//alert(e.submitter.id);
    	//var afmy=af;
	var a=af.action.value;
        var apid='ap_'; if (typeof(af.ap_id)!='undefined' ) { apid='ap'+af.ap_id.value+'_'; } //alert(apid);
	var ab=document.getElementById(apid+'form_btn'); //console.log(ab); //alert(typeof(ab));
	if (ab) { ab.disabled=true; }

	console.log('apid='+apid);
	document.getElementById(apid+'form_err').style.display='none';
	//af.querySelector("#ap_form_err").style.display='none';
	af.querySelectorAll('.error_note').forEach(e => e.parentNode.removeChild(e));
	af.querySelectorAll('.error_box').forEach(e => e.classList.remove("error_box"));

	var fd=new FormData(af);
	var cs=document.characterSet; //console.log(cs);
	var ct='application/x-www-form-urlencoded; charset=' + cs;

	fd.append('mode', 'API_JSON');
	if (a=='login') {
	  if ((document.getElementById('ap-modal-pop')!=null)&&(typeof(af.set_urlok)=='undefined')) {
	    console.log('r=auth skipped');
	  } else {
	    fd.append('r', 'auth');
	    console.log('r=auth added');
	  }
	}
	if ((typeof(af.elements["g-recaptcha-key"])!='undefined')&&(typeof(grecaptcha)!='undefined')) {
	  await new Promise((resolve, reject) => { grecaptcha.ready(resolve); });
          const token = await grecaptcha.execute(af.elements["g-recaptcha-key"].value, { action: a });
          fd.append("g-recaptcha-response",token); //alert(token);
	  //grecaptcha.ready(function() {
          //  grecaptcha.execute(af.elements["g-recaptcha-key"].value, {action: a}).then(function(token) {
	  //    fd.append("g-recaptcha-response",'xxx'+token); alert(token);
	  //  });
          //});
	}
	var fds = new URLSearchParams(fd).toString();
	//alert(fds);
	//alert (af.login.value);
	//try { var r = await fetch(af.attributes["action"].value, {method: "POST", body: fd }); } catch(err) { console.log(err); xaf.submit(); }
	try { var r = await fetch(af.attributes["action"].value, {method: "POST", body: fds, headers: { "Content-Type": 'application/x-www-form-urlencoded' } }); } catch(err) { console.log(err); xaf.submit(); }
	//try { var r = await fetch("$auth_url?user=$in{'user'}&action="+a+"&mode=API_JSON&r=auth&email="+encodeURIComponent(af.email.value) , {method: "GET", xmode: 'no-cors'}); } catch(err) { af.submit(); }
	//try { var r = await fetch("$auth_url?user=$in{'user'}&action=login&mode=API_JSON&r=auth&login="+encodeURIComponent(lf.login.value)+"&password="+encodeURIComponent(lf.password.value) , {method: "GET", xmode: 'no-cors'}); } catch(err) { lf.submit(); }
	try { var j = await r.json(); } catch(err) { console.log(err); aaf.submit(); }
	if (ab) { ab.disabled=false; }

	console.log(j);

	var res=j.result;
	var mes=''; if (typeof(j.message) != 'undefined') mes=j.message;
	var url=''; if (/^https?:/.test(mes)) url=mes;
	if ((res == 'FAIL')&&(typeof(j.fail_url) != 'undefined')) { url=j.fail_url; }
	//alert(res + url);

	console.log('ref by '+document.referrer);

	if (url.length > 10) { 

	  let t=af.getAttribute('target');
	  if (t=='_top') { top.location.href=url; }
	  else if (t=='_blank') {
	    console.log(t);
	    window.open(url, '_blank').focus();
	  } else {
	    console.log('replacing to '+url);
	    document.location.href=url;
	  }

	  return false;
	};
	if ((res == 'FAIL')||(res == 'ERROR')) {

	  if (typeof(j.errors)!='undefined') {
	    for (let err of j.errors) { 
	      if (err.src != '') {
	        var en=document.createElement("span");
	        en.classList.add("error_note");
	        en.innerHTML=err.mes;
                //console.log(err.src);
                //let snl=document.getElementsByName(err.src);
                //console.log(err.src+' -> '+snl.length);
                //console.log(af[err.src]);
                //if (snl.length>0) {
                  //let sn=snl[snl.length-1];
                let sn=af[err.src];
                console.log('Found field for err src ('+err.src+'): '+sn+' (type: '+sn.type+')');
                if (typeof(sn)!='undefined') {
                  if (typeof(sn.length)=='undefined') { sn.classList.add("error_box"); }
                  if (typeof(sn.length)!='undefined') { sn=sn[sn.length-1]; }
                  //console.log(sn);
                  let snn=sn.nextSibling; if ((sn.type=='radio')||(sn.type=='checkbox')) {snn=snn.nextElementSibling;} 
                  //console.log(snn); 
                  if ((sn.type=='checkbox')&&(/^https?:/.test(snn))) {snn=snn.nextElementSibling;}
                  //if (snn.type=='a') {snn=snn.nextSibling;}
	          sn.parentNode.insertBefore(en, snn);
	        } else {
	          if (mes == null) { mes=''; }//mes=mes.replace(/^null/g, ""); 
	          if (mes != '') { mes += '<br>'; }
	          mes += err.mes;
	        }
	      } 
	    }
	  }
	    //for (let inp of inps) { inp.style.display='none'; }
	  if (mes !== null) { 
	    document.getElementById(apid+'form_errmes').innerHTML=mes; 
	    //af.querySelector("#ap_form_errmes").innerHTML=mes; 
	    let afe=document.getElementById(apid+'form_err');
	    if (afe.nodeName == "TR") { afe.style.display='table-row' } else { afe.style.display='block' }
	    //alert('-'+mes+'-');
	    //return false; 
	  } //else { af.submit(); }


	} else { 
	  if (a == 'login') { 
	    // logged in
	    if ((typeof(af.urlok)!='undefined')&&(af.urlok.value.match(/^js:/))) {
	      console.log('aaa:'+auth_res);
	      if (typeof(auth_res)!='undefined') {auth_res='ok'; }
	      let r=af.urlok.value.match(/^js:(\w+)/); let jf=r[1];
	      console.log('urkok-js: '+jf);
	      eval(jf+'()');
	      return false;
	    }
	    if (res == 'PUP') {
	      af.action.value='pup';
	      document.getElementById(apid+'form_head').innerHTML=j.title; 
	      document.getElementById(apid+'table_login').innerHTML=decodeURIComponent(escape(window.atob(mes)));
	    } else {
	      if ((document.getElementById('ap-modal-pop')!=null)&&(typeof(af.set_urlok)=='undefined')) {
	        document.getElementById("ap-modal-pop").style.display = "none";
	        console.log('AP popup closed');
	        if (typeof(ap_popup_closed) == 'function') { ap_popup_closed(af.login.value); } 
	      } else { 
	        af.submit(); 
	        af.password.value='';
	        if ( (typeof(af.remember)=='undefined') || ((typeof(af.remember)!='undefined')&&(!af.remember.checked)) ) { af.login.value=''; }
	      }
	    }
	  } else {
 	    if ((a=='reg2')&&(typeof(af.x_pcs_np_reg)!='undefined')) {
	      if ((af.x_pcs_np_reg.value=='PP')&&(af.x_pcs_np_url.value.match(/^submit:/))) {
	        let r=af.x_pcs_np_url.value.match(/^submit:(\w+)/); let ppf=r[1];
	        document.forms[ppf]["custom"].value+=af._login.value;
	        document.forms[ppf].submit();
	        return false;
	      }
	      if ((af.x_pcs_np_reg.value=='ST')&&(af.x_pcs_np_url.value.match(/^js:/))) {
	        let r=af.x_pcs_np_url.value.match(/^js:(\w+)/); let stf=r[1];
	        console.log(stf);
	        eval(stf+'()');
	        return false;
	      }
	    }
	    if ((a=='reg2')||(a=='edit2')) try { mes=decodeURIComponent(escape(window.atob(mes))); } catch(e) {}
	    //document.getElementsByClassName('ap_form_inp')[0].innerHTML="<td colspan='3'>"+mes+"</td>"; 
	    //af.parentNode.removeChild(af);
	    if (document.getElementById('ap_form_isb')!=null) { document.getElementById('ap_form_isb').style.display='none'; }
	    var inps=document.getElementsByClassName('ap_form_inp')
	    for (let inp of inps) { inp.style.display='none'; }
	    document.getElementById('ap_form_infmes').innerHTML=ap_prepare(mes); 
	    let afi=document.getElementById('ap_form_inf');
	    if (afi.nodeName == "TR") { afi.style.display='table-row' } else { afi.style.display='block' }
	    //document.getElementById('ap_form_inf').style.display='table-row';
	  }
	  if (a=='reg2') {
	    document.getElementById('ap_form_head').innerHTML=j.title; 
	  }
	  if (a=='edit2') { 
	    af.action.value='edit3';
	    document.getElementById('ap_form_isb').style.display='none';
	  }
	  if (a=='lost2') { 
	    document.getElementById('ap_form_isb').style.display='none';
	  }
	  if (a == 'del2') {
	    if(typeof(af.confirm)=='undefined') {
	      var cf = document.createElement('input'); cf.type = 'hidden'; cf.name = 'confirm'; cf.value = '1';
	      af.appendChild(cf);
	      el_show(document.getElementById('ap_form_isb'));
	    } else {
	      document.getElementById('ap_form_isb').style.display='none';
	    }
	  }
	  return false; 
	}
  }
}

function el_show (el) {
  if (el.nodeName == "TR") { el.style.display='table-row' } else { el.style.display='block' }
}

function ap_prepare (mes) {
  console.log(mes);
  mes=mes.replace('{back}', '<br><input type="button" id="ap_form_btn" value="&lt;&lt; Back" onclick="history.back()" />');
  console.log(mes);
  return mes;
}
