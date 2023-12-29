"use strict";(self.webpackChunkjira_time_tracker=self.webpackChunkjira_time_tracker||[]).push([[776],{63776:(e,s,a)=>{a.d(s,{ErrorBoundary:()=>ue,IssuesPage:()=>ne,loaderIssues:()=>le});var t=a(60235),i=a(42708),r=a(59908),n=a(82792),o=a(67294),l=a(2321),d=a(13191),c=a(74064),u=a(81083),m=a(10769),g=a(91304);const h={color:"white",classNames:{root:"bg-[var(--mantine-color-error)]",title:"text-[var(--mantine-color-default)]",description:"text-[var(--mantine-color-default)]",closeButton:"text-[var(--mantine-color-default)] hover:bg-[var(--mantine-color-dark-outline)]"}},y=2e3,j=()=>(0,c.t)({queryKey:["tasks"],queryFn:async e=>{const s=m.j.getState().getIssueIdsSearchParams(),a=await u.b.get("/tasks",{params:{jql:m.j.getState().jql,startAt:20*e.pageParam,maxResults:20},signal:e.signal});return{...a.data,issues:a.data.issues.filter((e=>!s.includes(e.id)))}},getNextPageParam:(e,s,a,t)=>e.issues.length>0?a+1:null,initialPageParam:0});var v=a(85893);const x=()=>{const{ref:e,inView:s}=(0,i.YD)(),{isLoading:a,isFetching:t,isFetchingNextPage:d,hasNextPage:c,fetchNextPage:u}=(0,r.N)(j());return(0,o.useEffect)((()=>{s&&!t&&u()}),[s,t]),!a&&(0,v.jsxs)(n.z,{variant:"light",color:"blue",onClick:()=>u(),fullWidth:!0,children:[d?"Loading more...":c?"Load More":"Nothing more to load",(0,v.jsx)("span",{ref:e,className:(0,l.cn)("invisible",{hidden:d})})]})},p=(0,o.memo)(x);var f=a(21760),N=a(40327);const k=async e=>{const s=await u.b.post("/jql-search",{includeCollapsedFields:!0},{params:{url:e}});return{jqlFields:s.data.visibleFieldNames,jqlFunctions:s.data.visibleFunctionNames}},I=async e=>(await u.b.get("/jql-search",{params:{url:e}})).data;var b=a(30202),w=a(96205),S=a(88198),q=a(88565);const C=e=>{const{className:s}=e,a=(0,b.NL)(),t=(0,m.j)((e=>e.jql)),{mutate:i,isPending:r}=(0,w.D)({mutationFn:()=>u.b.put("/filter-details",{jql:m.j.getState().jql},{params:{id:m.j.getState().filterId}}),onMutate:()=>{const e=g.N9.show({title:"Searching",message:"",loading:!0});a.invalidateQueries({queryKey:["tasks"]}).then((()=>{g.N9.update({id:e,title:"Searching",message:"",icon:(0,v.jsx)(S.Z,{style:{width:(0,q.h)(18),height:(0,q.h)(18)}}),loading:!1,autoClose:y})})).catch((()=>{g.N9.hide(e)}))},onError:e=>{var s;g.N9.show({title:"Error loading issue",message:null===(s=e.response)||void 0===s?void 0:s.data.errorMessages.join(", "),...h})}}),n=(0,N.R)("autocomplete",k,I);return(0,v.jsx)("div",{className:(0,l.cn)("mb-[1.5rem] [&_div_div:nth-child(1)]:bg-[var(--mantine-color-default)]",s),children:(0,v.jsx)(f.L,{isSearching:r,analyticsSource:"autocomplete",query:t,onSearch:(e,s)=>{0===s.errors.length&&s.represents!==m.j.getState().jql&&(m.j.getState().updateJQL(e),i())},autocompleteProvider:n,locale:"en"})})},K=(0,o.memo)(C);var P=a(78551),D=a(29855),E=a(85453),M=a(36209),F=a(39448),Q=a(32543),U=a(14260),z=a(84714),Z=a(56485),L=a(2276);const _=e=>{const s=Math.floor(e/60),a=Math.floor(s/60);return"".concat(String(a).padStart(2,"0"),":").concat(String(s%60).padStart(2,"0"))};var A=a(80830),T=a(89341);const O=e=>{const{issueId:s,onChange:a,children:t,status:i,position:r="bottom-start",disabled:n}=e,[d,c]=(0,o.useState)(!1),{data:m,isLoading:g}=(0,P.a)({queryKey:["statuses task",s],queryFn:()=>u.b.get("/statuses-task",{params:{id:s}}),select:e=>e.data,enabled:d});return(0,v.jsxs)(A.v,{shadow:"md",onChange:n?void 0:c,position:r,disabled:n,children:[(0,v.jsx)(A.v.Target,{children:t}),(0,v.jsxs)(A.v.Dropdown,{children:[g&&Array.from({length:5},((e,s)=>(0,v.jsx)(A.v.Item,{children:(0,v.jsx)(T.O,{w:100,h:20,bg:"cyan.6"})},s))),!g&&(null==m?void 0:m.transitions.map((e=>(0,v.jsx)(A.v.Item,{onClick:()=>a(e),value:e.name,className:(0,l.cn)({"bg-[var(--mantine-color-dark-light)]":i.id===e.id}),children:e.name},e.id))))]})]})};var B=a(93513);const H=e=>{const{issueId:s,queryKey:a,children:t,status:i,issueName:r,position:n,disabled:o,idxPage:l,idxIssue:d,onChange:c}=e,m=(0,b.NL)(),{mutate:j}=(0,w.D)({mutationFn:e=>u.b.post("/change-status-task",{taskId:s,transitionId:e.id}),onMutate:async e=>{await m.cancelQueries({queryKey:[a]}),m.setQueryData([a],(s=>Array.isArray(s)?(0,B.Uy)(s,(s=>{s[d].fields.status=e.to})):(0,B.Uy)(s,(s=>{s.pages[l].issues[d].fields.status=e.to})))),"function"==typeof c&&c();const s="from ".concat(i.name," to ").concat(e.name);return{notificationId:g.N9.show({title:"Status changes",message:s,loading:!0}),notificationMessage:s,oldState:m.getQueryData([a])}},onSuccess:(e,s,t)=>{g.N9.update({id:t.notificationId,autoClose:y,loading:!1,icon:(0,v.jsx)(S.Z,{style:{width:(0,q.h)(18),height:(0,q.h)(18)}}),message:t.notificationMessage}),m.invalidateQueries({queryKey:[a]})},onError:(e,s,t)=>{var i;g.N9.hide(t.notificationId),g.N9.show({title:"Error issue ".concat(r),message:null===(i=e.response)||void 0===i?void 0:i.data.errorMessages.join(", "),...h}),m.setQueryData([a],t.oldState)}});return(0,v.jsx)(O,{issueId:s,status:i,position:n,disabled:o,onChange:e=>j(e),children:t})};var J=a(27484),W=a.n(J);const R=()=>{const[e,s]=(0,o.useState)(W()().startOf("day")),a=e.format("HH:mm:ss");return(0,o.useEffect)((()=>{let e;return e=setInterval((()=>{s((e=>e.add(1,"second")))}),1e3),()=>clearInterval(e)}),[]),(0,v.jsx)(F.C,{mb:10,size:"xl",radius:"sm",variant:"filled",children:a})},V=e=>{const{taskId:s}=e,[a,t]=(0,o.useState)(!1),i=(0,b.NL)(),r=(0,w.D)({mutationFn:e=>e.id?u.b.put("/worklog-task",e):u.b.post("/worklog-task",e),onMutate:()=>{i.setQueryData(["tasks tracking"],(e=>(0,B.Uy)(e,(e=>{const a=e.find((e=>e.id===s));a&&(a.fields.timespent+=60)}))))}}),n=(0,P.a)({queryKey:["worklog",s],queryFn:async()=>{const e=await u.b.get("/worklog-task",{params:{id:s}}),a=i.getQueryData(["login"]);if(a){var t;const i=e.data.worklogs.find((e=>e.author.accountId==a.accountId&&W()(e.started).isToday())),n=(e=>{const s=Math.floor(e/28800);e%=28800;const a=Math.floor(e/3600);e%=3600;const t=Math.floor(e/60);return"".concat(s,"d ").concat(a,"h ").concat(t,"m")})((null!==(t=null==i?void 0:i.timeSpentSeconds)&&void 0!==t?t:0)+60);i?r.mutate({taskId:s,timeSpent:n,id:i.id}):r.mutate({taskId:s,timeSpent:n})}return!0},refetchInterval:6e4,refetchOnWindowFocus:!1,gcTime:0,enabled:a,notifyOnChangeProps:["error"]});(0,o.useEffect)((()=>{const e=setTimeout((()=>{t(!0)}),6e4);return()=>clearTimeout(e)}),[]),(0,o.useEffect)((()=>{var e;n.error&&g.N9.show({title:"Error worklog issue",message:null===(e=n.error.response)||void 0===e?void 0:e.data.errorMessages.join(", "),...h})}),[n]),(0,o.useEffect)((()=>{var e;r.error&&g.N9.show({title:"Error worklog issue",message:null===(e=r.error.response)||void 0===e?void 0:e.data.errorMessages.join(", "),...h})}),[r.error])};var Y=a(8861);const G=e=>{var s,a;const{issueKey:t,assignee:i,onChange:r,children:n,position:d="bottom-start"}=e,[c,m]=(0,o.useState)(!1),{data:g,isLoading:h}=(0,P.a)({queryKey:["assignable issue",t],queryFn:()=>u.b.get("/issue-assignable",{params:{id:t}}),select:e=>[...e.data,{accountId:null,displayName:"Unassigned",avatarUrls:void 0}].sort(((e,s)=>e.displayName.localeCompare(s.displayName))),enabled:c});return(0,v.jsxs)(A.v,{shadow:"md",onChange:m,position:d,children:[(0,v.jsx)(A.v.Target,{children:n({name:null!==(s=null==i?void 0:i.displayName)&&void 0!==s?s:"Unassigned",ImageComponent:null!=i&&null!==(a=i.avatarUrls)&&void 0!==a&&a["48x48"]?(0,v.jsx)(Q.E,{h:20,w:20,loading:"lazy",src:i.avatarUrls["48x48"]}):(0,v.jsx)(Y.Z,{height:23,width:23,color:"black"})})}),(0,v.jsxs)(A.v.Dropdown,{children:[h&&Array.from({length:5},((e,s)=>(0,v.jsx)(A.v.Item,{children:(0,v.jsx)(T.O,{w:100,h:20,bg:"cyan.6"})},s))),!h&&(null==g?void 0:g.map((e=>{var s;return(0,v.jsx)(A.v.Item,{onClick:()=>r(e),className:(0,l.cn)({"bg-[var(--mantine-color-dark-light)]":e.accountId===(null==i?void 0:i.accountId)}),value:e.displayName,leftSection:null!=e&&null!==(s=e.avatarUrls)&&void 0!==s&&s["48x48"]?(0,v.jsx)(Q.E,{h:20,w:20,loading:"lazy",src:e.avatarUrls["48x48"]}):(0,v.jsx)(Y.Z,{height:23,width:23,color:"black"}),children:e.displayName},e.accountId)})))]})]})},X=e=>{const{issueKey:s,idxIssue:a,issueName:t,idxPage:i,assignee:r,children:n,queryKey:o,position:l="bottom-start"}=e,d=(0,b.NL)(),{mutate:c}=(0,w.D)({mutationFn:e=>u.b.put("/issue-assignee",{accountId:e.accountId},{params:{id:s}}),onMutate:async e=>{var s;await d.cancelQueries({queryKey:[o]}),d.setQueryData([o],(s=>Array.isArray(s)?(0,B.Uy)(s,(s=>{s[a].fields.assignee=e})):(0,B.Uy)(s,(s=>{s.pages[i].issues[a].fields.assignee=e}))));const t="from ".concat(null!==(s=null==r?void 0:r.displayName)&&void 0!==s?s:"Unassigned"," to ").concat(e.displayName),n=g.N9.show({title:"Assignee changes",message:t,loading:!0});return{oldState:d.getQueryData([o]),notificationId:n,notificationMessage:t}},onSuccess:(e,s,a)=>{g.N9.update({id:a.notificationId,autoClose:y,loading:!1,icon:(0,v.jsx)(S.Z,{style:{width:(0,q.h)(18),height:(0,q.h)(18)}}),message:a.notificationMessage}),d.invalidateQueries({queryKey:[o]})},onError:(e,s,a)=>{var i;g.N9.hide(a.notificationId),g.N9.show({title:'Error issue "'.concat(t,'"'),message:null===(i=e.response)||void 0===i?void 0:i.data.errorMessages.join(", "),...h}),d.setQueryData([o],a.oldState)}});return(0,v.jsx)(G,{assignee:r,issueKey:s,onChange:c,position:l,children:n})},$=e=>{const{fields:s,id:a,idxIssue:i,issueKey:r}=e,l=(0,b.NL)(),[d,c]=(0,o.useState)(!1);V({taskId:a});return(0,v.jsxs)(D.Z,{shadow:"sm",radius:"md",bg:"teal.0",mb:"sm",withBorder:!0,children:[(0,v.jsx)(R,{}),(0,v.jsxs)(E.Z,{mb:10,justify:"space-between",children:["indeterminate"!==s.status.statusCategory.key&&(0,v.jsx)(M.b,{className:"w-[100%]",variant:"light",color:"red",title:"Warning!",icon:(0,v.jsx)(Z.Z,{}),children:'This task is not in the "In progress" status please change its status. However, time continues to be logged for it.'}),(0,v.jsx)(t.D,{order:5,children:s.summary}),(0,v.jsxs)(F.C,{color:"blue",className:"flex-row",children:[(0,v.jsx)("span",{className:"mr-[0.5rem]",children:_(s.timespent)}),(0,v.jsx)("span",{className:"mr-[0.5rem]",children:"/"}),(0,v.jsx)("span",{children:_(s.timeoriginalestimate)})]})]}),(0,v.jsxs)(E.Z,{mb:10,children:[(0,v.jsxs)(F.C,{size:"md",variant:"light",leftSection:(0,v.jsx)(Q.E,{height:18,width:18,loading:"lazy",className:"rounded",src:s.project.avatarUrls["32x32"]}),children:["Project: ",s.project.name]}),(0,v.jsxs)(F.C,{variant:"light",leftSection:(0,v.jsx)(Q.E,{height:18,width:18,loading:"lazy",className:"rounded",src:s.priority.iconUrl}),children:["priority: ",s.priority.name]}),(0,v.jsxs)(F.C,{variant:"light",children:["key: ",r]})]}),(0,v.jsxs)(E.Z,{justify:"space-between",children:[(0,v.jsxs)(E.Z,{children:[(0,v.jsx)(H,{issueId:a,issueName:s.summary,status:s.status,idxIssue:i,queryKey:"tasks tracking",children:(0,v.jsx)(n.z,{variant:"outline",size:"xs",children:s.status.name})}),(0,v.jsx)(X,{assignee:s.assignee,issueName:s.summary,issueKey:r,idxIssue:i,queryKey:"tasks tracking",children:e=>{let{name:s,ImageComponent:a}=e;return(0,v.jsx)(n.z,{variant:"outline",size:"xs",leftSection:a,children:s})}})]}),d?(0,v.jsx)(U.a,{size:"sm"}):(0,v.jsx)(z.A,{variant:"light",onClick:async()=>{m.j.getState().changeIssueIdsSearchParams("delete",a),c(!0),await l.invalidateQueries({queryKey:["tasks"]}),c(!1),l.setQueryData(["tasks tracking"],(e=>(0,B.Uy)(e,(e=>{const s=e.findIndex((e=>e.id===a));e.splice(s,1)}))))},children:(0,v.jsx)(L.Z,{className:"cursor-pointer [&_path]:fill-[var(--mantine-color-violet-5)]"})})]})]},a)},ee=(0,o.memo)($),se=()=>{const{data:e}=(0,P.a)((0,d.C)({queryKey:["tasks tracking"],queryFn:async e=>{const s=m.j.getState().getIssueIdsSearchParams();return s?(await Promise.allSettled(s.split(",").map((s=>u.b.get("/issue",{params:{id:s},signal:e.signal}))))).reduce(((e,s)=>{if("fulfilled"===s.status&&e.push(s.value.data),"rejected"===s.status){var a,t;const e=s.reason;m.j.getState().changeIssueIdsSearchParams("delete",s.reason.config.params.id),g.N9.show({title:"Issue ".concat(null===(a=e.config)||void 0===a?void 0:a.params.id),message:null===(t=e.response)||void 0===t?void 0:t.data.errorMessages.join(", "),...h})}return e}),[]):[]}}));return(0,v.jsx)(v.Fragment,{children:null==e?void 0:e.map(((e,s)=>(0,v.jsx)(ee,{issueKey:e.key,idxIssue:s,fields:e.fields,id:e.id},e.id)))})};var ae=a(87311);const te=e=>{const{fields:s,id:a,idxPage:i,idxIssue:r,issueKey:o}=e,l=(0,b.NL)(),d=()=>{m.j.getState().changeIssueIdsSearchParams("add",a),l.setQueryData(["tasks tracking"],(e=>{const s=l.getQueryData(["tasks"]);return(0,B.Uy)(e,(e=>{s&&e.unshift(s.pages[i].issues[r])}))})),l.setQueryData(["tasks"],(e=>(0,B.Uy)(e,(e=>{e.pages[i].issues.splice(r,1)}))))};return(0,v.jsxs)(D.Z,{shadow:"sm",radius:"md",mb:"sm",withBorder:!0,children:[(0,v.jsxs)(E.Z,{mb:10,justify:"space-between",children:[(0,v.jsx)(t.D,{order:5,children:s.summary}),(0,v.jsxs)(F.C,{color:"blue",className:"flex-row",children:[(0,v.jsx)("span",{className:"mr-[0.5rem]",children:_(s.timespent)}),(0,v.jsx)("span",{className:"mr-[0.5rem]",children:"/"}),(0,v.jsx)("span",{children:_(s.timeoriginalestimate)})]})]}),(0,v.jsxs)(E.Z,{mb:10,children:[(0,v.jsxs)(F.C,{size:"md",variant:"light",leftSection:(0,v.jsx)(Q.E,{height:18,width:18,loading:"lazy",className:"rounded",src:s.project.avatarUrls["32x32"]}),children:["Project: ",s.project.name]}),(0,v.jsxs)(F.C,{variant:"light",leftSection:(0,v.jsx)(Q.E,{height:18,width:18,loading:"lazy",className:"rounded",src:s.priority.iconUrl}),children:["priority: ",s.priority.name]}),(0,v.jsxs)(F.C,{variant:"light",children:["key: ",o]})]}),(0,v.jsxs)(E.Z,{justify:"space-between",children:[(0,v.jsxs)(E.Z,{children:[(0,v.jsx)(H,{issueId:a,issueName:s.summary,status:s.status,idxPage:i,idxIssue:r,queryKey:"tasks",children:(0,v.jsx)(n.z,{variant:"outline",size:"xs",children:s.status.name})}),(0,v.jsx)(X,{assignee:s.assignee,issueName:s.summary,issueKey:o,idxPage:i,idxIssue:r,queryKey:"tasks",children:e=>{let{name:s,ImageComponent:a}=e;return(0,v.jsx)(n.z,{variant:"outline",size:"xs",leftSection:a,children:s})}})]}),(0,v.jsx)(H,{issueId:a,issueName:s.summary,status:s.status,idxPage:i,idxIssue:r,queryKey:"tasks",position:"left",onChange:()=>d(),disabled:"indeterminate"===s.status.statusCategory.key,children:(0,v.jsx)(ae.Z,{className:"cursor-pointer [&_path]:fill-[var(--mantine-color-violet-5)]",..."indeterminate"===s.status.statusCategory.key&&{onClick:d}})})]})]},a)},ie=(0,o.memo)(te),re=()=>{const{data:e,error:s}=(0,r.N)(j());return(0,o.useEffect)((()=>{var e;s&&g.N9.show({title:"Error loading task",message:null===(e=s.response)||void 0===e?void 0:e.data.errorMessages.join(", "),...h})}),[s]),(0,v.jsx)(v.Fragment,{children:null==e?void 0:e.pages.map(((e,s)=>e.issues.map(((e,a)=>(0,v.jsx)(ie,{issueKey:e.key,idxPage:s,idxIssue:a,fields:e.fields,id:e.id},e.id)))))})},ne=()=>(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(t.D,{mb:10,order:2,children:"Issues"}),(0,v.jsx)(K,{}),(0,v.jsx)(se,{}),(0,v.jsx)(re,{}),(0,v.jsx)(p,{})]}),oe="___TimeTracking___",le=async()=>{let e="";const s=await u.b.get("/filters",{params:{filterValue:oe}});if(s.data.values.length>0){const a=s.data.values[0].id,t=await u.b.get("/filter-details",{params:{id:a}});m.j.getState().setFilterId(a),e=t.data.jql}else{e=(await u.b.post("/filter-details",{name:oe,description:"",jql:""})).data.jql}return m.j.getState().updateJQL(e),!0};var de=a(89250),ce=a(17010);const ue=()=>{var e,s,a,t;const i=(0,de.lk)();return(0,v.jsx)("div",{className:"h-[100%] flex items-center justify-center",children:(0,v.jsx)(M.b,{variant:"light",color:"red",title:"Status error - ".concat(null===(e=i.response)||void 0===e?void 0:e.status),icon:(0,v.jsx)(ce.Z,{}),children:null!==(s=null===(a=i.response)||void 0===a||null===(a=a.data)||void 0===a||null===(a=a.errorMessages)||void 0===a?void 0:a.join(", "))&&void 0!==s?s:JSON.stringify(null===(t=i.response)||void 0===t?void 0:t.data)})})}}}]);