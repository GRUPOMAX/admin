(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{409:function(e,a,t){e.exports=t(657)},415:function(e,a,t){},416:function(e,a,t){},417:function(e,a,t){},420:function(e,a,t){},421:function(e,a,t){},422:function(e,a,t){},423:function(e,a,t){},424:function(e,a,t){},425:function(e,a,t){},426:function(e,a,t){},429:function(e,a,t){},430:function(e,a,t){},431:function(e,a,t){},436:function(e,a,t){},437:function(e,a,t){},438:function(e,a,t){},439:function(e,a,t){},655:function(e,a,t){},656:function(e,a,t){},657:function(e,a,t){"use strict";t.r(a);var r=t(0),l=t.n(r),n=t(374),o=t.n(n),c=(t(415),t(14)),m=t(120),s=t(685),i=t(683),u=t(677),p=t(682);t(416);var d=()=>{const e=Object(c.p)(),a=Object(c.n)().pathname;return l.a.createElement("div",{className:"company-selector"},l.a.createElement("select",{onChange:a=>{const t=a.target.value;e(t)},value:a},l.a.createElement("option",{value:"/home/max-fibra"},"Max Fibra"),l.a.createElement("option",{value:"/home/vir-telecom"},"Vir Telecom"),l.a.createElement("option",{value:"/home/reis-services"},"Reis Service")))};t(417);const{Sider:E}=s.a,{Search:b}=i.a,{Title:h}=u.a;var g=()=>{const e=Object(c.n)().pathname,a={"/home/max-fibra":[{name:"Dashboard",href:"/home/home"},{name:"Consulta CNPJ",href:"/home/max-fibra/consultaCNPJ"},{name:"Cadastro Vendedor",href:"/home/max-fibra/cadastro"}],"/home/vir-telecom":[{name:"Consultar CNPJ",href:"/home/max-fibra/consultaCNPJ"}],"/home/reis-services":[{name:"Op\xe7\xe3o 1 - Reis",href:"/reis-services/opcao1"},{name:"Op\xe7\xe3o 2 - Reis",href:"/reis-services/opcao2"}],"/home/max-fibra/consultaCNPJ":[{name:"Dashboard",href:"/max-fibra/consultaCPF"},{name:"Pagina Inicial",href:"/max-fibra"}],"/home/max-fibra/consultaCPF":[{name:"Pagina Inicial",href:"/max-fibra"},{name:"Consulta CNPJ",href:"/max-fibra/consultaCNPJ"}],"/home/max-fibra/cadastro":[{name:"Pagina inical",href:"/home"}],"/home/home":[{name:"Max Fibra",href:"/home/max-fibra"},{name:"Cadastro Vendedor",href:"/home/max-fibra/cadastro"}],"/home":[{name:"Max Fibra",href:"/home/max-fibra"},{name:"Cadastro Vendedor",href:"/home/max-fibra/cadastro"},{name:"Consulta CNPJ",href:"/home/max-fibra/consultaCNPJ"}]}[e]||[];return l.a.createElement(E,{className:"sidebar",width:250,theme:"light"},l.a.createElement("div",{className:"search-bar"},l.a.createElement(b,{placeholder:"Pesquisa...",enterButton:!0})),l.a.createElement("div",{className:"dynamic-menu"},a.length>0&&l.a.createElement(l.a.Fragment,null,l.a.createElement(h,{level:4},"Menu"),l.a.createElement(p.a,{mode:"inline",selectedKeys:[e]},a.map((e,a)=>l.a.createElement(p.a.Item,{key:e.href},l.a.createElement(m.c,{to:e.href},e.name)))))),l.a.createElement(d,null))};t(420);var f=e=>{let{text:a,closePopup:t}=e;return l.a.createElement("div",{className:"popup"},l.a.createElement("div",{className:"popup-content",dangerouslySetInnerHTML:{__html:a}}),l.a.createElement("button",{className:"popup-close",onClick:t},"Fechar"))};t(421);var v=e=>{let{url:a,closePopup:t}=e;const[n,o]=Object(r.useState)(!1),[c,m]=Object(r.useState)({top:"20px",left:"20px"}),[s,i]=Object(r.useState)({x:0,y:0}),u=Object(r.useCallback)(e=>{n&&m({top:`${e.clientY-s.y}px`,left:`${e.clientX-s.x}px`})},[n,s]),p=()=>{o(!1)};return Object(r.useEffect)(()=>(window.addEventListener("mousemove",u),window.addEventListener("mouseup",p),()=>{window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",p)}),[u]),l.a.createElement("div",{className:"popup-iframe",style:{top:c.top,left:c.left},onMouseDown:e=>{0===e.button&&(o(!0),i({x:e.clientX-parseInt(c.left,10),y:e.clientY-parseInt(c.top,10)}))},onClick:e=>e.stopPropagation()},l.a.createElement("div",{className:"popup-iframe-header"},l.a.createElement("span",{className:"popup-iframe-close",onClick:t},"\xd7"),l.a.createElement("div",{className:"popup-iframe-title"},"Gerador de Proposta")),l.a.createElement("iframe",{src:a,width:"100%",height:"100%",frameBorder:"0",title:"Popup Iframe"}))};t(422);var x=e=>{let{message:a}=e;return a?l.a.createElement("div",{className:"notification"},a):null};t(423);var C=()=>{const[e]=Object(r.useState)([]);return Object(r.useEffect)(()=>{(async()=>{})()},[]),l.a.createElement("div",null,l.a.createElement(x,{message:e.length>0?"ONUS OFFLINE":""}))};t(424);var S=e=>{let{url:a,imgSrc:t,altText:n,text:o,popupText:c,isIframe:m,isEquipamentos:s}=e;const[i,u]=Object(r.useState)(!1),[p,d]=Object(r.useState)(!1),[E,b]=Object(r.useState)(!1),[h,g]=Object(r.useState)(null);return l.a.createElement("div",{className:"link-item-container"},l.a.createElement("div",{className:"link-item",onMouseEnter:()=>{(c||s)&&(h&&clearTimeout(h),u(!0),s&&b(!0))},onMouseLeave:()=>{if(c||s){const e=setTimeout(()=>{u(!1),b(!1)},2e3);g(e)}}},l.a.createElement("a",{href:a,onClick:e=>{e.preventDefault(),m?d(!0):window.open(a,"_blank","noopener noreferrer")},rel:"noopener noreferrer"},l.a.createElement("img",{src:t,alt:n}),l.a.createElement("p",null,o))),i&&l.a.createElement(f,{text:c,closePopup:()=>{u(!1),h&&clearTimeout(h)}}),p&&l.a.createElement(v,{url:a,closePopup:()=>{d(!1)}}),E&&l.a.createElement(C,{closePopup:()=>{b(!1)}}))};t(425);var P=()=>{return l.a.createElement("div",{className:"max-fibra"},l.a.createElement(g,null),l.a.createElement("div",{className:"content-max-fibra"},[{title:"Programas IXC",links:[{url:"https://ixc.maxfibraltda.com.br/adm.php",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-PROVEDOR.png",altText:"IXC",text:"IXC",popupText:'Para acessar esse atalho \xe9 <br>necess\xe1rio fazer <strong> <a href="https://ixc.maxfibraltda.com.br/adm.php" target="_blank" rel="noopener noreferrer">Login</a></strong>'},{url:"https://ixc.maxfibraltda.com.br/mapas.php?mode=fiber",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-IMAP.png",altText:"IXC - FiberDocs",text:"IXC - Imap"},{url:"https://ixc.maxfibraltda.com.br/mapas.php?mode=service",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-SERVICE.png",altText:"IXC - Service",text:"IXC - Service"},{url:"https://acs.maxfibraltda.com.br/",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/PRO-1-1.gif",altText:"IXC - ACS",text:"IXC - ACS"}]},{title:"Atendimento ao Publico",links:[{url:"https://maxfibra.opasuite.com.br",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/OPA-Max.png",altText:"Opa! Suite",text:"OpaSuite!"},{url:"https://chatwoot.nexusnerds.com.br",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/06/PRO-1.gif",altText:"Chatwoot",text:"Chatwoot"}]},{title:"Programa R8",links:[{url:"https://www.r8rastreadores.com.br/map",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/06/R8-RASTREIO-1.jpg",altText:"R8 - RASTREIO",text:"R8 Rastreadores"}]},{title:"Analise e Monitoramento",links:[{url:"https://grupomaxltda.smartolt.com/",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/SMART-OLT.png",altText:"SMART-OLT",text:"Smart-Olt",isEquipamentos:!1},{url:"http://172.25.255.20:3000/login",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/Grafana.png",altText:"GRAFANA",text:"Grafana"}]},{title:"Administra\xe7\xe3o e Controle",links:[{url:"https://autenticador.secullum.com.br/Authorization?response_type=code&client_id=3&redirect_uri=https%3A%2F%2Fpontoweb.secullum.com.br%2FAuth",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/Secullum.png",altText:"SECULLUM",text:"Secullum - Ponto"},{url:"https://credlocaliza.com.br/sistema/account/login",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/CRED-LOCALIZA.jpg",altText:"CredLocaliza",text:"CredLocaliza"},{url:"https://www.playhub.com.br/APP/Login",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/07/Copia-de-PRO.gif",altText:"PlayHub",text:"PlayHub"},{url:"https://maxfibra.myog.io/admin/",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/08/DATACAKE.png",altText:"Area Administra\xe7\xe3o - Totem",text:"Area Administra\xe7\xe3o - Totem"},{url:"https://grupomax.github.io/Gerador_Proposta_Comercial/",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/08/PropostaComecial.jpg",altText:"Gerador de Proposta",text:"Gerador de Proposta",isIframe:!0},{url:"https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/08/PRO.gif",altText:"CPF CONSULTA",text:"Consulta CPF"}]},{title:"Programas \xfateis",links:[{url:"https://www.canva.com/pt_br/",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/Canva.png",altText:"Canva",text:"Canva",popupText:"Para acessar esse atalho \xe9 <br> necess\xe1rio est\xe1 conectado em uma <br>conta do <strong>Grupo Max</strong>"},{url:"https://mail.google.com/mail",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/gmail.png",altText:"Gmail",text:"Gmail"},{url:"https://trello.com/u/grupomax4/boards",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/Trello.png",altText:"Trello",text:"Trello"},{url:"https://warnerbros.ent.box.com/s/ykklojfiaf7taxwfnwsdapsybbbxjrev",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/PRO-3.gif",altText:"Driver",text:"Driver - PlayHub"}]}].map((e,a)=>l.a.createElement("div",{key:a},l.a.createElement("h2",null,e.title),l.a.createElement("div",{className:"link-container-max-fibra"},e.links.map((e,a)=>l.a.createElement(S,Object.assign({key:a},e))))))))},w=t(670),T=t(671);t(426);var N=()=>{return l.a.createElement("div",{className:"home-virtelecom"},l.a.createElement(g,null),l.a.createElement("div",{className:"content-virtelecom"},[{title:"Programas Administra\xe7\xe3o",links:[{url:"https://vir.ispcloud.com.br",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/06/ISP-CLOUD.jpg",altText:"ISP-Cloud",text:"ISP"},{url:"https://portaloperacional.vtal.com.br/portal",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/07/PORTAL-VTAL.jpg",altText:"Portal Operacional",text:"Portal Operacional",popupText:'Caso a Tela esteja em Branco <br>Clique <strong> <a href="https://portaloperacional.vtal.com.br/" target="_blank" rel="noopener noreferrer">Login</a></strong>'}]},{title:"Atendimento ao Publico",links:[{url:"https://vir.opasuite.com.br",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/06/OPA-VIR.jpg",altText:"Opa! Suite",text:"OpaSuite!"},{url:"https://chatwoot.nexusnerds.com.br",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/06/PRO-1.gif",altText:"Chatwoot",text:"Chatwoot"}]},{title:"Administra\xe7\xe3o e Controle",links:[{url:"https://app.powerbi.com/view?r=eyJrIjoiMjAzODkwOTQtOTRiOS00OGM0LTgzMzktOWE4YzZjNzdiNmUyIiwidCI6IjljZTY2NzI4LThmZmQtNDEzNS1hZTFkLTNiMmUyNjVlMjhlOSJ9",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/07/powerBI.jpg",altText:"DFV",text:"DFV",isIframe:!0},{url:"https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/08/PRO.gif",altText:"CPF CONSULTA",text:"Consulta CPF"}]},{title:"Programas \xfateis",links:[{url:"https://www.canva.com/pt_br/",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/Canva.png",altText:"Canva",text:"Canva",popupText:"Para acessar esse atalho \xe9 <br> necess\xe1rio estar conectado em uma <br>conta do <strong>Grupo Max</strong>"},{url:"https://trello.com/u/grupomax4/boards",imgSrc:"https://maxfibraltda.com.br/wp-content/uploads/2024/05/Trello.png",altText:"Trello",text:"Trello"}]}].map((e,a)=>l.a.createElement("div",{key:a},l.a.createElement("h2",null,e.title),l.a.createElement(w.a,{gutter:[16,16],className:"link-container-virtelecom"},e.links.map((e,a)=>l.a.createElement(T.a,{xs:24,sm:12,md:8,lg:6,key:a},l.a.createElement(S,e))))))))};var y=()=>l.a.createElement("div",null,l.a.createElement("h1",null,"Reis Services"),l.a.createElement("p",null,"Conte\xfado da p\xe1gina Reis Services."));var O=()=>l.a.createElement(m.a,null,l.a.createElement("div",{className:"App"},l.a.createElement(c.d,null,l.a.createElement(c.b,{path:"/max-fibra",element:l.a.createElement(P,null)}),l.a.createElement(c.b,{path:"/vir-telecom",element:l.a.createElement(N,null)}),l.a.createElement(c.b,{path:"/reis-services",element:l.a.createElement(y,null)}),l.a.createElement(c.b,{path:"/contact",element:l.a.createElement(O,null)})))),I=t(680),j=t(676),k=t(678),A=t(673),R=t(681),F=t(222),D=t(179),L=t.n(D);t(428),t(429);const{Title:q}=u.a,{Option:_}=I.a,{Step:M}=j.a;var z=()=>{const[e]=k.a.useForm(),[a,t]=l.a.useState(0),[r,n]=l.a.useState({}),o=[{title:"Passo 1",content:l.a.createElement("div",{className:"form-container"},l.a.createElement(k.a.Item,{name:"NomeCompleto",label:"Nome Completo",rules:[{required:!0,message:"Por favor, insira seu nome completo!"}]},l.a.createElement(i.a,{placeholder:"Digite seu nome completo"})),l.a.createElement(k.a.Item,{name:"CPF_FISICO",label:"CPF",rules:[{required:!0,message:"Por favor, insira seu CPF!"}]},l.a.createElement(L.a,{mask:"999.999.999-99",placeholder:"Digite seu CPF"},e=>l.a.createElement(i.a,e))),l.a.createElement(k.a.Item,{name:"RG",label:"RG",rules:[{required:!0,message:"Por favor, insira seu RG!"}]},l.a.createElement(i.a,{placeholder:"Digite seu RG"})),l.a.createElement(k.a.Item,{name:"NASCIMENTO",label:"Data de Nascimento",rules:[{required:!0,message:"Por favor, insira sua data de nascimento!"}]},l.a.createElement(A.a,{placeholder:"Selecione a data",format:"DD/MM/YYYY"})))},{title:"Passo 2",content:l.a.createElement("div",{className:"form-container"},l.a.createElement(k.a.Item,{name:"EMAIL_CONTATO",label:"Email",rules:[{required:!0,message:"Por favor, insira seu email!"}]},l.a.createElement(i.a,{placeholder:"Digite seu email"})),l.a.createElement(k.a.Item,{name:"Tel_01",label:"Telefone 1",rules:[{required:!0,message:"Por favor, insira seu telefone!"}]},l.a.createElement(L.a,{mask:"(99) 99999-9999",placeholder:"Digite seu telefone"},e=>l.a.createElement(i.a,e))),l.a.createElement(k.a.Item,{name:"Tel_02",label:"Telefone 2",rules:[{required:!0,message:"Por favor, insira seu telefone!"},e=>{let{getFieldValue:a}=e;return{validator:(e,t)=>t&&a("Tel_01")===t?Promise.reject(new Error("O Telefone 2 n\xe3o pode ser igual ao Telefone 1.")):Promise.resolve()}}]},l.a.createElement(L.a,{mask:"(99) 99999-9999",placeholder:"Digite um segundo telefone (opcional)"},e=>l.a.createElement(i.a,e))))},{title:"Passo 3",content:l.a.createElement("div",{className:"form-container"},l.a.createElement(k.a.Item,{name:"Cidade",label:"Cidade",rules:[{required:!0,message:"Por favor, insira sua cidade!"}]},l.a.createElement(i.a,{placeholder:"Digite sua cidade"})),l.a.createElement(k.a.Item,{name:"Bairro",label:"Bairro",rules:[{required:!0,message:"Por favor, insira seu bairro!"}]},l.a.createElement(i.a,{placeholder:"Digite seu bairro"})),l.a.createElement(k.a.Item,{name:"Endereco_Completo",label:"End.: Completo",rules:[{required:!0,message:"Por favor, insira seu endere\xe7o!"}]},l.a.createElement(i.a,{placeholder:"Digite seu endere\xe7o completo"})),l.a.createElement(k.a.Item,{name:"cep_residencia",label:"CEP",rules:[{required:!0,message:"Por favor, insira seu CEP!"}]},l.a.createElement(L.a,{mask:"99999-999",placeholder:"Digite seu CEP"},e=>l.a.createElement(i.a,e))),l.a.createElement(k.a.Item,{name:"n_residencia",label:"N\xaa da Resid\xeancia",rules:[{required:!0,message:"Por favor, insira o n\xfamero da resid\xeancia!"}]},l.a.createElement(i.a,{placeholder:"Digite o n\xfamero da resid\xeancia"})),l.a.createElement(k.a.Item,{name:"complemento",label:"Complemento",rules:[{required:!1}]},l.a.createElement(i.a,{placeholder:"Digite o complemento (opcional)"})),l.a.createElement(k.a.Item,{name:"Referencia_Endereco",label:"Ref.: de Endere\xe7o",rules:[{required:!1}]},l.a.createElement(i.a,{placeholder:"Digite a refer\xeancia de endere\xe7o (opcional)"})))},{title:"Passo 4",content:l.a.createElement("div",{className:"form-container"},l.a.createElement(k.a.Item,{name:"Plano_Selecionado",label:"Plano Selecionado",rules:[{required:!0,message:"Por favor, selecione um plano!"}]},l.a.createElement(I.a,{placeholder:"Selecione um plano"},l.a.createElement(_,{value:"17"},"Turbo R$  99,90"),l.a.createElement(_,{value:"15"},"Infinity R$ 169,90"),l.a.createElement(_,{value:"14"},"Gold R$ 129,90"),l.a.createElement(_,{value:"13"},"Reten\xe7\xe3o R$ 59,90"),l.a.createElement(_,{value:"23"},"Streaming"))),l.a.createElement(k.a.Item,{name:"streaming_Adicional",label:"Streaming Adicional",rules:[{required:!1}]},l.a.createElement(I.a,{placeholder:"Selecione uma op\xe7\xe3o de streaming"},l.a.createElement(_,{value:"Streaming_Telas"},"Streaming Telas"),l.a.createElement(_,{value:"Streaming_ChromeCast"},"Streaming + ChomeCast"),l.a.createElement(_,{value:"Nao"},"N\xe3o"))),l.a.createElement(k.a.Item,{name:"Data_Vencimento",label:"Data de Vencimento",rules:[{required:!0,message:"Por favor, insira a data de vencimento!"}]},l.a.createElement(I.a,{placeholder:"Selecione a data Vencimento"},l.a.createElement(_,{value:"5"},"Dia 05"),l.a.createElement(_,{value:"10"},"Dia 10"),l.a.createElement(_,{value:"20"},"Dia 20"))))},{title:"Passo 5",content:l.a.createElement("div",{className:"form-container"},l.a.createElement(k.a.Item,{name:"vendedor",label:"Vendedor",rules:[{required:!0,message:"Por favor, insira o nome do vendedor!"}]},l.a.createElement(I.a,{placeholder:"Selecione o Vendedor"},l.a.createElement(_,{value:"Tatiara"},"Tatiara Kister"),l.a.createElement(_,{value:"Fabio"},"Fabio Morais"))))}];return l.a.createElement("div",{className:"cadastro-container"},l.a.createElement(q,{level:2},"Cadastro"),l.a.createElement(j.a,{current:a,className:"steps"},o.map(e=>l.a.createElement(M,{key:e.title,title:e.title}))),l.a.createElement("div",{className:"steps-content"},l.a.createElement(k.a,{form:e,onFinish:async e=>{try{const t={...r,...e};(await fetch("https://webhook.nexusnerds.com.br/webhook/7b6905d3-0548-464a-a620-9bbdffe66b97",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).ok?R.a.success("Dados enviados com sucesso!"):R.a.error("Falha ao enviar os dados. Tente novamente.")}catch(a){R.a.error("Erro ao conectar com o webhook.")}}},o[a].content,l.a.createElement("div",{className:"steps-action"},a>0&&l.a.createElement(F.a,{type:"default",className:"btn-prev",onClick:()=>{t(e=>Math.max(e-1,0))}},"Voltar"),a<o.length-1&&l.a.createElement(F.a,{type:"primary",className:"btn-next",onClick:async()=>{try{const r=await e.validateFields();n(e=>({...e,...r})),t(e=>Math.min(e+1,o.length-1)),e.resetFields()}catch(a){console.error("Erro ao validar os campos: ",a)}}},"Seguir"),a===o.length-1&&l.a.createElement(F.a,{type:"primary",htmlType:"submit",className:"btn-next"},"Concluir")))))};t(430);var J=()=>l.a.createElement("div",{className:"consulta-cpf"},l.a.createElement("h1",null,"Consulta CPF"),l.a.createElement("iframe",{className:"iframe-consulta",src:"https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp",title:"Consulta CPF"})),V=t(674),G=t(686),X=t(675);t(431);const{Title:$,Text:B}=u.a;var U=()=>{const[e,a]=Object(r.useState)(""),[t,n]=Object(r.useState)(null),[o,c]=Object(r.useState)(""),m=async e=>{try{const a="https://api.allorigins.win/raw?url=",t=`https://www.receitaws.com.br/v1/cnpj/${e}`,r=await X.a.get(a+encodeURIComponent(t));if(200!==r.status)throw new Error(`Erro na resposta da API: ${r.status} ${r.statusText}`);const l=r.data;if("ERROR"===l.status)throw new Error(l.message||"Erro desconhecido");n(l)}catch(o){console.error("Erro ao buscar dados:",o),c(o.message),n(null)}};return l.a.createElement("div",{className:"consulta-cnpj-container"},l.a.createElement(V.a,{style:{maxWidth:800,margin:"20px auto",padding:"20px",minHeight:"400px"}},l.a.createElement($,{level:3},"Consulta de CNPJ"),l.a.createElement(k.a,{layout:"vertical",onFinish:async()=>{c("");const a=e.replace(/[^\d]+/g,"");14===a.length?await m(a):c("Por favor, insira um CNPJ v\xe1lido com 14 d\xedgitos.")}},l.a.createElement(k.a.Item,{label:"Digite o CNPJ",validateStatus:o?"error":"",help:o||""},l.a.createElement(i.a,{value:e,onChange:e=>a(e.target.value),placeholder:"00.000.000/0000-00",maxLength:18})),l.a.createElement(F.a,{type:"primary",htmlType:"submit",block:!0},"Consultar")),t&&l.a.createElement("div",{className:"company-data",style:{marginTop:20}},l.a.createElement($,{level:4},t.nome),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"CNPJ:")," ",t.cnpj),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"Abertura:")," ",t.abertura),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"Situa\xe7\xe3o:")," ",t.situacao),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"Tipo:")," ",t.tipo),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"Porte:")," ",t.porte),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"Natureza Jur\xeddica:")," ",t.natureza_juridica),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"Atividade Principal:")," ",t.atividade_principal[0].text," (",t.atividade_principal[0].code,")"),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"Endere\xe7o:")," ",t.logradouro,", ",t.numero," ",t.complemento,", ",t.bairro,", ",t.municipio," - ",t.uf,", CEP: ",t.cep),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"Telefone:")," ",t.telefone),l.a.createElement("p",null,l.a.createElement(B,{strong:!0},"\xdaltima Atualiza\xe7\xe3o:")," ",new Date(t.ultima_atualizacao).toLocaleString()),l.a.createElement($,{level:5},"Quadro de S\xf3cios e Administradores:"),l.a.createElement("ul",null,t.qsa.map(e=>l.a.createElement("li",{key:e.nome},e.nome," - ",e.qual))),l.a.createElement("div",{className:"footer"},l.a.createElement(B,{strong:!0},"Consulta realizada em:")," ",(new Date).toLocaleString()," - ",l.a.createElement(B,{strong:!0},"by Jota"))),o&&l.a.createElement(G.a,{message:"Erro",description:o,type:"error",showIcon:!0,style:{marginTop:20}})))};t(436);const{Title:Y}=u.a;var K=e=>{let{onLogin:a}=e;const[t,n]=Object(r.useState)(!1),o=Object(c.p)();return l.a.createElement("div",{className:"login-container"},l.a.createElement("div",{className:"login-form-wrapper"},l.a.createElement(V.a,{style:{maxWidth:400,margin:"auto",padding:20}},l.a.createElement(Y,{level:3,style:{textAlign:"center"}},"Login"),l.a.createElement(k.a,{layout:"vertical",onFinish:e=>{n(!0),setTimeout(()=>{"admin"===e.username&&"admin"===e.password?(a(!0),o("/max-fibra")):R.a.error("Credenciais inv\xe1lidas"),n(!1)},1e3)}},l.a.createElement(k.a.Item,{label:"Usu\xe1rio",name:"username",rules:[{required:!0,message:"Por favor, insira seu usu\xe1rio!"}]},l.a.createElement(i.a,{placeholder:"Digite seu usu\xe1rio"})),l.a.createElement(k.a.Item,{label:"Senha",name:"password",rules:[{required:!0,message:"Por favor, insira sua senha!"}]},l.a.createElement(i.a.Password,{placeholder:"Digite sua senha"})),l.a.createElement(k.a.Item,null,l.a.createElement(F.a,{type:"primary",htmlType:"submit",block:!0,loading:t},"Entrar"))))))},H=t(684);t(437);const{Title:W,Text:Z}=u.a;var Q=()=>{const[e,a]=Object(r.useState)(null),[t,n]=Object(r.useState)(!0),[o,c]=Object(r.useState)(null);return Object(r.useEffect)(()=>{(async()=>{try{const e="https://apidoixc.nexusnerds.com.br",t=(await X.a.get(`${e}/resultado`)).data.resultado;a(t)}catch(o){c("Erro ao buscar os dados."),console.error("Erro ao fazer a requisi\xe7\xe3o:",o)}finally{n(!1)}})()},[]),l.a.createElement(V.a,{className:"clientes-ativos-dashboard",bordered:!1,style:{width:300,boxShadow:"0 4px 8px rgba(0, 0, 0, 0.2)",borderRadius:"8px",padding:"20px",backgroundColor:"#52c41a"}},l.a.createElement(W,{level:3,style:{color:"white"}},"Clientes Ativos"),t?l.a.createElement(H.a,null):o?l.a.createElement(Z,{type:"danger",style:{fontSize:"16px"}},o):l.a.createElement(Z,{style:{fontSize:"24px",fontWeight:"bold",color:"white"}},null!==e?e:"N/A"))};t(438);const{Title:ee,Text:ae}=u.a;var te=()=>{const[e,a]=Object(r.useState)(null),[t,n]=Object(r.useState)(!0),[o,c]=Object(r.useState)(null);return Object(r.useEffect)(()=>{(async()=>{try{const e="https://www.apidoixc.nexusnerds.com.br",t=await X.a.get(`${e}/filtered_count`),r=Number(t.data.count);a(r)}catch(o){c("Erro ao buscar os dados."),console.error("Erro ao fazer a requisi\xe7\xe3o:",o)}finally{n(!1)}})()},[]),l.a.createElement(V.a,{className:"clientes-bloqueados-dashboard",bordered:!1,style:{width:300,boxShadow:"0 4px 8px rgba(0, 0, 0, 0.4)",borderRadius:"8px",padding:"20px",backgroundColor:"#f5222d"}},l.a.createElement(ee,{level:3,style:{color:"white"}},"Clientes Bloqueados"),t?l.a.createElement(H.a,null):o?l.a.createElement(ae,{type:"danger",style:{fontSize:"16px"}},o):l.a.createElement(ae,{style:{fontSize:"24px",fontWeight:"bold",color:"white"}},null!==e?e:"N/A"))},re=t(679),le=t(402),ne=t(403),oe=t(137),ce=t(178),me=t(224);t(439);const{Title:se,Text:ie}=u.a;var ue=()=>{const[e,a]=Object(r.useState)([]),[t,n]=Object(r.useState)(!0),[o,c]=Object(r.useState)(null);return Object(r.useEffect)(()=>{(async()=>{try{const e="https://apidoixc.nexusnerds.com.br",t=await X.a.get(`${e}/bairros_count.json`);console.log("Resposta da API: Funcionando"),a(t.data)}catch(o){c("Erro ao buscar os dados."),console.error("Erro ao fazer a requisi\xe7\xe3o:",o)}finally{n(!1)}})()},[]),l.a.createElement(V.a,{className:"dist-bairros-dashboard",bordered:!1,style:{width:"100%",borderRadius:"8px",padding:"20px",backgroundColor:"#ffffff"}},l.a.createElement(se,{level:3},"Distribui\xe7\xe3o dos Bairros"),t?l.a.createElement(H.a,null):o?l.a.createElement(ie,{type:"danger"},o):l.a.createElement("div",{className:"bar-chart-container",style:{textAlign:"center"}},l.a.createElement(re.a,{width:900,height:300,data:e},l.a.createElement(le.a,{dataKey:"bairro",tick:!1})," ",l.a.createElement(ne.a,null),l.a.createElement(oe.a,null),l.a.createElement(ce.a,null),l.a.createElement(me.a,{dataKey:"count",fill:"#04c21d",name:"Casas Conectadas"})," ")))};t(655);var pe=()=>l.a.createElement("div",{className:"home-container"},l.a.createElement(w.a,{gutter:[16,16]},l.a.createElement(T.a,{span:12},l.a.createElement("div",{className:"dashboard-container"},l.a.createElement(Q,null))),l.a.createElement(T.a,{span:12},l.a.createElement("div",{className:"dashboard-container"},l.a.createElement(te,null)))),l.a.createElement(w.a,{gutter:[16,16]},l.a.createElement(T.a,{span:24},l.a.createElement("div",{className:"dist-bairros-container"},l.a.createElement(ue,null)))));t(656);const de=()=>{const[e,a]=Object(r.useState)(()=>"true"===localStorage.getItem("isAuthenticated")),t=Object(c.n)();Object(r.useEffect)(()=>{"/"===t.pathname||"/login"===t.pathname?document.body.classList.add("login-background"):document.body.classList.remove("login-background")},[t]);return l.a.createElement("div",{className:`App ${"/cadastro"===t.pathname?"cadastro-page":""}`},l.a.createElement(c.d,null,e?l.a.createElement(l.a.Fragment,null,l.a.createElement(c.b,{path:"/home/*",element:l.a.createElement(Ee,{onLogout:()=>{a(!1),localStorage.removeItem("isAuthenticated"),window.location.href="/admin/#/login"}})}),l.a.createElement(c.b,{path:"*",element:l.a.createElement(c.a,{to:"/home",replace:!0})})):l.a.createElement(c.b,{path:"*",element:l.a.createElement(K,{onLogin:()=>{a(!0),localStorage.setItem("isAuthenticated","true")}})})),l.a.createElement("div",{className:"mobile-warning"},l.a.createElement("img",{src:"https://i.ibb.co/g9KDtqK/warning.png",alt:"Aviso"}),l.a.createElement("p",null,"O aplicativo est\xe1 dispon\xedvel apenas para desktop.")))},Ee=e=>{let{onLogout:a}=e;return l.a.createElement(l.a.Fragment,null,l.a.createElement("header",{className:"header"},l.a.createElement("span",{className:"header-title"},"Dashboard"),l.a.createElement("button",{className:"header-button",onClick:a},"Logout")),l.a.createElement("div",{className:"layout-container"},l.a.createElement(g,{onLogout:a}),l.a.createElement("div",{className:"content"},l.a.createElement(c.d,null,l.a.createElement(c.b,{path:"/",element:l.a.createElement(pe,null)}),l.a.createElement(c.b,{path:"/max-fibra",element:l.a.createElement(P,null)}),l.a.createElement(c.b,{path:"/max-fibra/consultaCPF",element:l.a.createElement(J,null)}),l.a.createElement(c.b,{path:"/max-fibra/consultaCNPJ",element:l.a.createElement(U,null)}),l.a.createElement(c.b,{path:"/vir-telecom",element:l.a.createElement(N,null)}),l.a.createElement(c.b,{path:"/reis-services",element:l.a.createElement(y,null)}),l.a.createElement(c.b,{path:"/contact",element:l.a.createElement(O,null)}),l.a.createElement(c.b,{path:"/max-fibra/cadastro",element:l.a.createElement(z,null)}),l.a.createElement(c.b,{path:"*",element:l.a.createElement(c.a,{to:"/home",replace:!0})})))))};var be=()=>l.a.createElement(m.b,{basename:"/"},l.a.createElement(de,null));var he=e=>{e&&e instanceof Function&&t.e(3).then(t.bind(null,687)).then(a=>{let{getCLS:t,getFID:r,getFCP:l,getLCP:n,getTTFB:o}=a;t(e),r(e),l(e),n(e),o(e)})};o.a.createRoot(document.getElementById("root")).render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(be,null))),he()}},[[409,1,2]]]);
//# sourceMappingURL=main.ba073e80.chunk.js.map