"use strict";(self.webpackChunkjira_time_tracker=self.webpackChunkjira_time_tracker||[]).push([[507],{75381:(t,r,e)=>{e.r(r),e.d(r,{CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD:()=>Q,getCustomThemeStyles:()=>$,loadAndAppendCustomThemeCss:()=>tt});var n=e(54771),o=e(61570),a=e(82794),c=e(64467),i=e(80296),u=e(45458);const s={"color.text.brand":"#579DFF","elevation.surface.overlay":"#282E33","color.background.selected":"#1C2B41","color.text.selected":"#579DFF","color.border.brand":"#579DFF","color.chart.brand":"#388BFF","color.text.inverse":"#1D2125"};var l=e(4035);const h={"color.text.brand":"#0C66E4","elevation.surface.sunken":"#F7F8F9","color.background.selected":"#E9F2FF","color.text.selected":"#0C66E4","color.border.brand":"#0C66E4","color.chart.brand":"#1D7AFC","color.text.inverse":"#FFFFFF"};var d=[{foreground:"color.text.brand",backgroundLight:"elevation.surface.sunken",backgroundDark:"elevation.surface.overlay",desiredContrast:4.5,updatedTokens:["color.text.brand","color.text.selected","color.link","color.link.pressed","color.icon.brand","color.icon.selected"]},{foreground:"color.text.brand",backgroundLight:"color.background.selected",backgroundDark:"color.background.selected",desiredContrast:4.5,updatedTokens:["color.text.brand","color.link","color.link.pressed"]},{foreground:"color.text.selected",backgroundLight:"color.background.selected",backgroundDark:"color.background.selected",desiredContrast:4.5,updatedTokens:["color.text.selected","color.icon.selected"]},{foreground:"color.border.brand",backgroundLight:"elevation.surface.sunken",backgroundDark:"elevation.surface.overlay",desiredContrast:3,updatedTokens:["color.border.brand","color.border.selected"]},{foreground:"color.chart.brand",backgroundLight:"elevation.surface.sunken",backgroundDark:"elevation.surface.overlay",desiredContrast:3,updatedTokens:["color.chart.brand","color.chart.brand.hovered"]}],b=function(t,r){return"light"===r?h[t]:s[t]},f=e(23029),v=e(92901);
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function M(t){return t<0?-1:0===t?0:1}function k(t,r,e){return(1-e)*t+e*r}function g(t,r,e){return e<t?t:e>r?r:e}function p(t){return(t%=360)<0&&(t+=360),t}function m(t,r){return[t[0]*r[0][0]+t[1]*r[0][1]+t[2]*r[0][2],t[0]*r[1][0]+t[1]*r[1][1]+t[2]*r[1][2],t[0]*r[2][0]+t[1]*r[2][1]+t[2]*r[2][2]]}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var w,y=[[.41233895,.35762064,.18051042],[.2126,.7152,.0722],[.01932141,.11916382,.95034478]],I=[[3.2413774792388685,-1.5376652402851851,-.49885366846268053],[-.9691452513005321,1.8758853451067872,.04156585616912061],[.05562093689691305,-.20395524564742123,1.0571799111220335]],C=[95.047,100,108.883];function O(t,r,e){return(255<<24|(255&t)<<16|(255&r)<<8|255&e)>>>0}function A(t){return O(P(t[0]),P(t[1]),P(t[2]))}function D(t){return t>>24&255}function L(t){return t>>16&255}function F(t){return t>>8&255}function T(t){return 255&t}function R(t){var r=function(t){return m([x(L(t)),x(F(t)),x(T(t))],y)}(t)[1];return 116*j(r/100)-16}function _(t){return 100*(e=24389/27,(n=(r=(t+16)/116)*r*r)>216/24389?n:(116*r-16)/e);var r,e,n}function E(t){return 116*j(t/100)-16}function x(t){var r=t/255;return r<=.040449936?r/12.92*100:100*Math.pow((r+.055)/1.055,2.4)}function P(t){var r,e,n,o=t/100,a=0;return a=o<=.0031308?12.92*o:1.055*Math.pow(o,1/2.4)-.055,r=0,e=255,(n=Math.round(255*a))<r?r:n>e?e:n}function S(t){return t<0?0:t>255?255:t}function j(t){return t>216/24389?Math.pow(t,1/3):(24389/27*t+16)/116}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var B=function(){function t(r){(0,f.A)(this,t),this.argb=r;var e=N.fromInt(r);this.internalHue=e.hue,this.internalChroma=e.chroma,this.internalTone=R(r),this.argb=r}return(0,v.A)(t,[{key:"toInt",value:function(){return this.argb}},{key:"hue",get:function(){return this.internalHue},set:function(t){this.setInternalState(q.solveToInt(t,this.internalChroma,this.internalTone))}},{key:"chroma",get:function(){return this.internalChroma},set:function(t){this.setInternalState(q.solveToInt(this.internalHue,t,this.internalTone))}},{key:"tone",get:function(){return this.internalTone},set:function(t){this.setInternalState(q.solveToInt(this.internalHue,this.internalChroma,t))}},{key:"setInternalState",value:function(t){var r=N.fromInt(t);this.internalHue=r.hue,this.internalChroma=r.chroma,this.internalTone=R(t),this.argb=t}},{key:"inViewingConditions",value:function(r){var e=N.fromInt(this.toInt()).xyzInViewingConditions(r),n=N.fromXyzInViewingConditions(e[0],e[1],e[2],U.make());return t.from(n.hue,n.chroma,E(e[1]))}}],[{key:"from",value:function(r,e,n){return new t(q.solveToInt(r,e,n))}},{key:"fromInt",value:function(r){return new t(r)}}]),t}(),N=function(){function t(r,e,n,o,a,c,i,u,s){(0,f.A)(this,t),this.hue=r,this.chroma=e,this.j=n,this.q=o,this.m=a,this.s=c,this.jstar=i,this.astar=u,this.bstar=s}return(0,v.A)(t,[{key:"distance",value:function(t){var r=this.jstar-t.jstar,e=this.astar-t.astar,n=this.bstar-t.bstar,o=Math.sqrt(r*r+e*e+n*n);return 1.41*Math.pow(o,.63)}},{key:"toInt",value:function(){return this.viewed(U.DEFAULT)}},{key:"viewed",value:function(t){var r=0===this.chroma||0===this.j?0:this.chroma/Math.sqrt(this.j/100),e=Math.pow(r/Math.pow(1.64-Math.pow(.29,t.n),.73),1/.9),n=this.hue*Math.PI/180,o=.25*(Math.cos(n+2)+3.8),a=t.aw*Math.pow(this.j/100,1/t.c/t.z),c=o*(5e4/13)*t.nc*t.ncb,i=a/t.nbb,u=Math.sin(n),s=Math.cos(n),l=23*(i+.305)*e/(23*c+11*e*s+108*e*u),h=l*s,d=l*u,b=(460*i+451*h+288*d)/1403,f=(460*i-891*h-261*d)/1403,v=(460*i-220*h-6300*d)/1403,k=Math.max(0,27.13*Math.abs(b)/(400-Math.abs(b))),g=M(b)*(100/t.fl)*Math.pow(k,1/.42),p=Math.max(0,27.13*Math.abs(f)/(400-Math.abs(f))),m=M(f)*(100/t.fl)*Math.pow(p,1/.42),w=Math.max(0,27.13*Math.abs(v)/(400-Math.abs(v))),y=M(v)*(100/t.fl)*Math.pow(w,1/.42),C=g/t.rgbD[0],A=m/t.rgbD[1],D=y/t.rgbD[2],L=function(t,r,e){var n=I,o=n[0][0]*t+n[0][1]*r+n[0][2]*e,a=n[1][0]*t+n[1][1]*r+n[1][2]*e,c=n[2][0]*t+n[2][1]*r+n[2][2]*e;return O(P(o),P(a),P(c))}(1.86206786*C-1.01125463*A+.14918677*D,.38752654*C+.62144744*A-.00897398*D,-.0158415*C-.03412294*A+1.04996444*D);return L}},{key:"xyzInViewingConditions",value:function(t){var r=0===this.chroma||0===this.j?0:this.chroma/Math.sqrt(this.j/100),e=Math.pow(r/Math.pow(1.64-Math.pow(.29,t.n),.73),1/.9),n=this.hue*Math.PI/180,o=.25*(Math.cos(n+2)+3.8),a=t.aw*Math.pow(this.j/100,1/t.c/t.z),c=o*(5e4/13)*t.nc*t.ncb,i=a/t.nbb,u=Math.sin(n),s=Math.cos(n),l=23*(i+.305)*e/(23*c+11*e*s+108*e*u),h=l*s,d=l*u,b=(460*i+451*h+288*d)/1403,f=(460*i-891*h-261*d)/1403,v=(460*i-220*h-6300*d)/1403,k=Math.max(0,27.13*Math.abs(b)/(400-Math.abs(b))),g=M(b)*(100/t.fl)*Math.pow(k,1/.42),p=Math.max(0,27.13*Math.abs(f)/(400-Math.abs(f))),m=M(f)*(100/t.fl)*Math.pow(p,1/.42),w=Math.max(0,27.13*Math.abs(v)/(400-Math.abs(v))),y=M(v)*(100/t.fl)*Math.pow(w,1/.42),I=g/t.rgbD[0],C=m/t.rgbD[1],O=y/t.rgbD[2];return[1.86206786*I-1.01125463*C+.14918677*O,.38752654*I+.62144744*C-.00897398*O,-.0158415*I-.03412294*C+1.04996444*O]}}],[{key:"fromInt",value:function(r){return t.fromIntInViewingConditions(r,U.DEFAULT)}},{key:"fromIntInViewingConditions",value:function(r,e){var n=(65280&r)>>8,o=255&r,a=x((16711680&r)>>16),c=x(n),i=x(o),u=.41233895*a+.35762064*c+.18051042*i,s=.2126*a+.7152*c+.0722*i,l=.01932141*a+.11916382*c+.95034478*i,h=.401288*u+.650173*s-.051461*l,d=-.250268*u+1.204414*s+.045854*l,b=-.002079*u+.048952*s+.953127*l,f=e.rgbD[0]*h,v=e.rgbD[1]*d,k=e.rgbD[2]*b,g=Math.pow(e.fl*Math.abs(f)/100,.42),p=Math.pow(e.fl*Math.abs(v)/100,.42),m=Math.pow(e.fl*Math.abs(k)/100,.42),w=400*M(f)*g/(g+27.13),y=400*M(v)*p/(p+27.13),I=400*M(k)*m/(m+27.13),C=(11*w+-12*y+I)/11,O=(w+y-2*I)/9,A=(20*w+20*y+21*I)/20,D=(40*w+20*y+I)/20,L=180*Math.atan2(O,C)/Math.PI,F=L<0?L+360:L>=360?L-360:L,T=F*Math.PI/180,R=D*e.nbb,_=100*Math.pow(R/e.aw,e.c*e.z),E=4/e.c*Math.sqrt(_/100)*(e.aw+4)*e.fLRoot,P=F<20.14?F+360:F,S=5e4/13*(.25*(Math.cos(P*Math.PI/180+2)+3.8))*e.nc*e.ncb*Math.sqrt(C*C+O*O)/(A+.305),j=Math.pow(S,.9)*Math.pow(1.64-Math.pow(.29,e.n),.73),B=j*Math.sqrt(_/100),N=B*e.fLRoot,q=50*Math.sqrt(j*e.c/(e.aw+4)),U=(1+100*.007)*_/(1+.007*_),z=1/.0228*Math.log(1+.0228*N);return new t(F,B,_,E,N,q,U,z*Math.cos(T),z*Math.sin(T))}},{key:"fromJch",value:function(r,e,n){return t.fromJchInViewingConditions(r,e,n,U.DEFAULT)}},{key:"fromJchInViewingConditions",value:function(r,e,n,o){var a=4/o.c*Math.sqrt(r/100)*(o.aw+4)*o.fLRoot,c=e*o.fLRoot,i=e/Math.sqrt(r/100),u=50*Math.sqrt(i*o.c/(o.aw+4)),s=n*Math.PI/180,l=(1+100*.007)*r/(1+.007*r),h=1/.0228*Math.log(1+.0228*c);return new t(n,e,r,a,c,u,l,h*Math.cos(s),h*Math.sin(s))}},{key:"fromUcs",value:function(r,e,n){return t.fromUcsInViewingConditions(r,e,n,U.DEFAULT)}},{key:"fromUcsInViewingConditions",value:function(r,e,n,o){var a=e,c=n,i=Math.sqrt(a*a+c*c),u=(Math.exp(.0228*i)-1)/.0228/o.fLRoot,s=Math.atan2(c,a)*(180/Math.PI);s<0&&(s+=360);var l=r/(1-.007*(r-100));return t.fromJchInViewingConditions(l,u,s,o)}},{key:"fromXyzInViewingConditions",value:function(r,e,n,o){var a=.401288*r+.650173*e-.051461*n,c=-.250268*r+1.204414*e+.045854*n,i=-.002079*r+.048952*e+.953127*n,u=o.rgbD[0]*a,s=o.rgbD[1]*c,l=o.rgbD[2]*i,h=Math.pow(o.fl*Math.abs(u)/100,.42),d=Math.pow(o.fl*Math.abs(s)/100,.42),b=Math.pow(o.fl*Math.abs(l)/100,.42),f=400*M(u)*h/(h+27.13),v=400*M(s)*d/(d+27.13),k=400*M(l)*b/(b+27.13),g=(11*f+-12*v+k)/11,p=(f+v-2*k)/9,m=(20*f+20*v+21*k)/20,w=(40*f+20*v+k)/20,y=180*Math.atan2(p,g)/Math.PI,I=y<0?y+360:y>=360?y-360:y,C=I*Math.PI/180,O=w*o.nbb,A=100*Math.pow(O/o.aw,o.c*o.z),D=4/o.c*Math.sqrt(A/100)*(o.aw+4)*o.fLRoot,L=I<20.14?I+360:I,F=5e4/13*(1/4*(Math.cos(L*Math.PI/180+2)+3.8))*o.nc*o.ncb*Math.sqrt(g*g+p*p)/(m+.305),T=Math.pow(F,.9)*Math.pow(1.64-Math.pow(.29,o.n),.73),R=T*Math.sqrt(A/100),_=R*o.fLRoot,E=50*Math.sqrt(T*o.c/(o.aw+4)),x=(1+100*.007)*A/(1+.007*A),P=Math.log(1+.0228*_)/.0228;return new t(I,R,A,D,_,E,x,P*Math.cos(C),P*Math.sin(C))}}]),t}(),q=function(){function t(){(0,f.A)(this,t)}return(0,v.A)(t,null,[{key:"sanitizeRadians",value:function(t){return(t+8*Math.PI)%(2*Math.PI)}},{key:"trueDelinearized",value:function(t){var r=t/100;return 255*(r<=.0031308?12.92*r:1.055*Math.pow(r,1/2.4)-.055)}},{key:"chromaticAdaptation",value:function(t){var r=Math.pow(Math.abs(t),.42);return 400*M(t)*r/(r+27.13)}},{key:"hueOf",value:function(r){var e=m(r,t.SCALED_DISCOUNT_FROM_LINRGB),n=t.chromaticAdaptation(e[0]),o=t.chromaticAdaptation(e[1]),a=t.chromaticAdaptation(e[2]),c=(11*n+-12*o+a)/11,i=(n+o-2*a)/9;return Math.atan2(i,c)}},{key:"areInCyclicOrder",value:function(r,e,n){return t.sanitizeRadians(e-r)<t.sanitizeRadians(n-r)}},{key:"intercept",value:function(t,r,e){return(r-t)/(e-t)}},{key:"lerpPoint",value:function(t,r,e){return[t[0]+(e[0]-t[0])*r,t[1]+(e[1]-t[1])*r,t[2]+(e[2]-t[2])*r]}},{key:"setCoordinate",value:function(r,e,n,o){var a=t.intercept(r[o],e,n[o]);return t.lerpPoint(r,a,n)}},{key:"isBounded",value:function(t){return 0<=t&&t<=100}},{key:"nthVertex",value:function(r,e){var n=t.Y_FROM_LINRGB[0],o=t.Y_FROM_LINRGB[1],a=t.Y_FROM_LINRGB[2],c=e%4<=1?0:100,i=e%2==0?0:100;if(e<4){var u=c,s=i,l=(r-u*o-s*a)/n;return t.isBounded(l)?[l,u,s]:[-1,-1,-1]}if(e<8){var h=c,d=i,b=(r-d*n-h*a)/o;return t.isBounded(b)?[d,b,h]:[-1,-1,-1]}var f=c,v=i,M=(r-f*n-v*o)/a;return t.isBounded(M)?[f,v,M]:[-1,-1,-1]}},{key:"bisectToSegment",value:function(r,e){for(var n=[-1,-1,-1],o=n,a=0,c=0,i=!1,u=!0,s=0;s<12;s++){var l=t.nthVertex(r,s);if(!(l[0]<0)){var h=t.hueOf(l);i?(u||t.areInCyclicOrder(a,h,c))&&(u=!1,t.areInCyclicOrder(a,e,h)?(o=l,c=h):(n=l,a=h)):(n=l,o=l,a=h,c=h,i=!0)}}return[n,o]}},{key:"midpoint",value:function(t,r){return[(t[0]+r[0])/2,(t[1]+r[1])/2,(t[2]+r[2])/2]}},{key:"criticalPlaneBelow",value:function(t){return Math.floor(t-.5)}},{key:"criticalPlaneAbove",value:function(t){return Math.ceil(t-.5)}},{key:"bisectToLimit",value:function(r,e){for(var n=t.bisectToSegment(r,e),o=n[0],a=t.hueOf(o),c=n[1],i=0;i<3;i++)if(o[i]!==c[i]){var u=-1,s=255;o[i]<c[i]?(u=t.criticalPlaneBelow(t.trueDelinearized(o[i])),s=t.criticalPlaneAbove(t.trueDelinearized(c[i]))):(u=t.criticalPlaneAbove(t.trueDelinearized(o[i])),s=t.criticalPlaneBelow(t.trueDelinearized(c[i])));for(var l=0;l<8&&!(Math.abs(s-u)<=1);l++){var h=Math.floor((u+s)/2),d=t.CRITICAL_PLANES[h],b=t.setCoordinate(o,d,c,i),f=t.hueOf(b);t.areInCyclicOrder(a,e,f)?(c=b,s=h):(o=b,a=f,u=h)}}return t.midpoint(o,c)}},{key:"inverseChromaticAdaptation",value:function(t){var r=Math.abs(t),e=Math.max(0,27.13*r/(400-r));return M(t)*Math.pow(e,1/.42)}},{key:"findResultByJ",value:function(r,e,n){for(var o=11*Math.sqrt(n),a=U.DEFAULT,c=1/Math.pow(1.64-Math.pow(.29,a.n),.73),i=.25*(Math.cos(r+2)+3.8)*(5e4/13)*a.nc*a.ncb,u=Math.sin(r),s=Math.cos(r),l=0;l<5;l++){var h=o/100,d=0===e||0===o?0:e/Math.sqrt(h),b=Math.pow(d*c,1/.9),f=a.aw*Math.pow(h,1/a.c/a.z)/a.nbb,v=23*(f+.305)*b/(23*i+11*b*s+108*b*u),M=v*s,k=v*u,g=(460*f+451*M+288*k)/1403,p=(460*f-891*M-261*k)/1403,w=(460*f-220*M-6300*k)/1403,y=m([t.inverseChromaticAdaptation(g),t.inverseChromaticAdaptation(p),t.inverseChromaticAdaptation(w)],t.LINRGB_FROM_SCALED_DISCOUNT);if(y[0]<0||y[1]<0||y[2]<0)return 0;var I=t.Y_FROM_LINRGB[0],C=t.Y_FROM_LINRGB[1],O=t.Y_FROM_LINRGB[2],D=I*y[0]+C*y[1]+O*y[2];if(D<=0)return 0;if(4===l||Math.abs(D-n)<.002)return y[0]>100.01||y[1]>100.01||y[2]>100.01?0:A(y);o-=(D-n)*o/(2*D)}return 0}},{key:"solveToInt",value:function(r,e,n){if(e<1e-4||n<1e-4||n>99.9999)return function(t){var r=P(_(t));return O(r,r,r)}(n);var o=(r=p(r))/180*Math.PI,a=_(n),c=t.findResultByJ(o,e,a);return 0!==c?c:A(t.bisectToLimit(a,o))}},{key:"solveToCam",value:function(r,e,n){return N.fromInt(t.solveToInt(r,e,n))}}]),t}();(0,c.A)(q,"SCALED_DISCOUNT_FROM_LINRGB",[[.001200833568784504,.002389694492170889,.0002795742885861124],[.0005891086651375999,.0029785502573438758,.0003270666104008398],[.00010146692491640572,.0005364214359186694,.0032979401770712076]]),(0,c.A)(q,"LINRGB_FROM_SCALED_DISCOUNT",[[1373.2198709594231,-1100.4251190754821,-7.278681089101213],[-271.815969077903,559.6580465940733,-32.46047482791194],[1.9622899599665666,-57.173814538844006,308.7233197812385]]),(0,c.A)(q,"Y_FROM_LINRGB",[.2126,.7152,.0722]),(0,c.A)(q,"CRITICAL_PLANES",[.015176349177441876,.045529047532325624,.07588174588720938,.10623444424209313,.13658714259697685,.16693984095186062,.19729253930674434,.2276452376616281,.2579979360165119,.28835063437139563,.3188300904430532,.350925934958123,.3848314933096426,.42057480301049466,.458183274052838,.4976837250274023,.5391024159806381,.5824650784040898,.6277969426914107,.6751227633498623,.7244668422128921,.775853049866786,.829304845476233,.8848452951698498,.942497089126609,1.0022825574869039,1.0642236851973577,1.1283421258858297,1.1946592148522128,1.2631959812511864,1.3339731595349034,1.407011200216447,1.4823302800086415,1.5599503113873272,1.6398909516233677,1.7221716113234105,1.8068114625156377,1.8938294463134073,1.9832442801866852,2.075074464868551,2.1693382909216234,2.2660538449872063,2.36523901573795,2.4669114995532007,2.5710888059345764,2.6777882626779785,2.7870270208169257,2.898822059350997,3.0131901897720907,3.1301480604002863,3.2497121605402226,3.3718988244681087,3.4967242352587946,3.624204428461639,3.754355295633311,3.887192587735158,4.022731918402185,4.160988767090289,4.301978482107941,4.445716283538092,4.592217266055746,4.741496401646282,4.893568542229298,5.048448422192488,5.20615066083972,5.3666897647573375,5.5300801301023865,5.696336044816294,5.865471690767354,6.037501145825082,6.212438385869475,6.390297286737924,6.571091626112461,6.7548350853498045,6.941541251256611,7.131223617812143,7.323895587840543,7.5195704746346665,7.7182615035334345,7.919981813454504,8.124744458384042,8.332562408825165,8.543448553206703,8.757415699253682,8.974476575321063,9.194643831691977,9.417930041841839,9.644347703669503,9.873909240696694,10.106627003236781,10.342513269534024,10.58158024687427,10.8238400726681,11.069304815507364,11.317986476196008,11.569896988756009,11.825048221409341,12.083451977536606,12.345119996613247,12.610063955123938,12.878295467455942,13.149826086772048,13.42466730586372,13.702830557985108,13.984327217668513,14.269168601521828,14.55736596900856,14.848930523210871,15.143873411576273,15.44220572664832,15.743938506781891,16.04908273684337,16.35764934889634,16.66964922287304,16.985093187232053,17.30399201960269,17.62635644741625,17.95219714852476,18.281524751807332,18.614349837764564,18.95068293910138,19.290534541298456,19.633915083172692,19.98083495742689,20.331304511189067,20.685334046541502,21.042933821039977,21.404114048223256,21.76888489811322,22.137256497705877,22.50923893145328,22.884842241736916,23.264076429332462,23.6469514538663,24.033477234264016,24.42366364919083,24.817520537484558,25.21505769858089,25.61628489293138,26.021211842414342,26.429848230738664,26.842203703840827,27.258287870275353,27.678110301598522,28.10168053274597,28.529008062403893,28.96010235337422,29.39497283293396,29.83362889318845,30.276079891419332,30.722335150426627,31.172403958865512,31.62629557157785,32.08401920991837,32.54558406207592,33.010999283389665,33.4802739966603,33.953417292456834,34.430438229418264,34.911345834551085,35.39614910352207,35.88485700094671,36.37747846067349,36.87402238606382,37.37449765026789,37.87891309649659,38.38727753828926,38.89959975977785,39.41588851594697,39.93615253289054,40.460400508064545,40.98864111053629,41.520882981230194,42.05713473317016,42.597404951718396,43.141702194811224,43.6900349931913,44.24241185063697,44.798841244188324,45.35933162437017,45.92389141541209,46.49252901546552,47.065252796817916,47.64207110610409,48.22299226451468,48.808024568002054,49.3971762874833,49.9904556690408,50.587870934119984,51.189430279724725,51.79514187861014,52.40501387947288,53.0190544071392,53.637271562750364,54.259673423945976,54.88626804504493,55.517063457223934,56.15206766869424,56.79128866487574,57.43473440856916,58.08241284012621,58.734331877617365,59.39049941699807,60.05092333227251,60.715611475655585,61.38457167773311,62.057811747619894,62.7353394731159,63.417162620860914,64.10328893648692,64.79372614476921,65.48848194977529,66.18756403501224,66.89098006357258,67.59873767827808,68.31084450182222,69.02730813691093,69.74813616640164,70.47333615344107,71.20291564160104,71.93688215501312,72.67524319850172,73.41800625771542,74.16517879925733,74.9167682708136,75.67278210128072,76.43322770089146,77.1981124613393,77.96744375590167,78.74122893956174,79.51947534912904,80.30219030335869,81.08938110306934,81.88105503125999,82.67721935322541,83.4778813166706,84.28304815182372,85.09272707154808,85.90692527145302,86.72564993000343,87.54890820862819,88.3767072518277,89.2090541872801,90.04595612594655,90.88742016217518,91.73345337380438,92.58406282226491,93.43925555268066,94.29903859396902,95.16341895893969,96.03240364439274,96.9059996312159,97.78421388448044,98.6670533535366,99.55452497210776]);var U=function(){function t(r,e,n,o,a,c,i,u,s,l){(0,f.A)(this,t),this.n=r,this.aw=e,this.nbb=n,this.ncb=o,this.c=a,this.nc=c,this.rgbD=i,this.fl=u,this.fLRoot=s,this.z=l}return(0,v.A)(t,null,[{key:"make",value:function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:C,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:200/Math.PI*_(50)/100,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:50,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:2,a=arguments.length>4&&void 0!==arguments[4]&&arguments[4],c=r,i=.401288*c[0]+.650173*c[1]+-.051461*c[2],u=-.250268*c[0]+1.204414*c[1]+.045854*c[2],s=-.002079*c[0]+.048952*c[1]+.953127*c[2],l=.8+o/10,h=l>=.9?k(.59,.69,10*(l-.9)):k(.525,.59,10*(l-.8)),d=a?1:l*(1-1/3.6*Math.exp((-e-42)/92)),b=l,f=[(d=d>1?1:d<0?0:d)*(100/i)+1-d,d*(100/u)+1-d,d*(100/s)+1-d],v=1/(5*e+1),M=v*v*v*v,g=1-M,p=M*e+.1*g*g*Math.cbrt(5*e),m=_(n)/r[1],w=1.48+Math.sqrt(m),y=.725/Math.pow(m,.2),I=y,O=[Math.pow(p*f[0]*i/100,.42),Math.pow(p*f[1]*u/100,.42),Math.pow(p*f[2]*s/100,.42)],A=[400*O[0]/(O[0]+27.13),400*O[1]/(O[1]+27.13),400*O[2]/(O[2]+27.13)];return new t(m,(2*A[0]+A[1]+.05*A[2])*y,y,I,h,b,f,p,Math.pow(p,.25),w)}}]),t}();w=U,(0,c.A)(U,"DEFAULT",w.make());
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var z=function(){function t(){(0,f.A)(this,t)}return(0,v.A)(t,null,[{key:"ratioOfTones",value:function(r,e){return r=g(0,100,r),e=g(0,100,e),t.ratioOfYs(_(r),_(e))}},{key:"ratioOfYs",value:function(t,r){var e=t>r?t:r;return(e+5)/((e===r?t:r)+5)}},{key:"lighter",value:function(r,e){if(r<0||r>100)return-1;var n=_(r),o=e*(n+5)-5,a=t.ratioOfYs(o,n),c=Math.abs(a-e);if(a<e&&c>.04)return-1;var i=E(o)+.4;return i<0||i>100?-1:i}},{key:"darker",value:function(r,e){if(r<0||r>100)return-1;var n=_(r),o=(n+5)/e-5,a=t.ratioOfYs(n,o),c=Math.abs(a-e);if(a<e&&c>.04)return-1;var i=E(o)-.4;return i<0||i>100?-1:i}},{key:"lighterUnsafe",value:function(r,e){var n=t.lighter(r,e);return n<0?100:n}},{key:"darkerUnsafe",value:function(r,e){var n=t.darker(r,e);return n<0?0:n}}]),t}();function V(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function Y(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?V(Object(e),!0).forEach((function(r){(0,c.A)(t,r,e[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):V(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r))}))}return t}var G=[1.12,1.33,2.03,2.73,3.33,4.27,5.2,6.62,12.46,14.25],H=[1.08,1.24,1.55,1.99,2.45,3.34,4.64,6.1,10.19,12.6],J=function(t,r){var e=0,n=null;return t.forEach((function(t,o){var a=(0,l._W)((0,l.E2)(t),(0,l.E2)(r));(null===n||a<n)&&(e=o,n=a)})),e},X=function(t){var r,e,n,o,a,c,i,s,h=(0,l.oW)(t)[0],d=(0,l.In)(h,100,60),b=(0,l.qe)(d[0],d[1],d[2])<.4?G:H,f=(0,l.xK)(t),v=B.fromInt((r={r:f[0],g:f[1],b:f[2],a:f[3]},e=r.r,n=r.g,o=r.b,a=r.a,c=S(e),i=S(n),s=S(o),S(a)<<24|c<<16|i<<8|s)),M=b.map((function(t){var r,e={r:L(r=B.from(v.hue,v.chroma,z.darker(100,t)+.25).toInt()),g:F(r),b:T(r),a:D(r)};return(0,l.Ob)(e.r,e.g,e.b)})),k=J(M,t),g=(0,u.A)(M);return g[k]=t,{ramp:g,replacedColor:M[k]}};function Z(t,r,e){for(var n=[],o=1;o<=r;o++)t+o<e.length?n.push(t+o):n.push(t-(o-(e.length-1-t)));return n}var W=function(t,r,e){var n=e||X(t).ramp,o=function(t,r,e){var n=X(t),o=n.ramp,a=n.replacedColor,c=e||o,u=J(c,t),h={},d={},b=(0,l.eM)(t,"#FFFFFF");if(b>=4.5){var f=Z(u,2,c),v=(0,i.A)(f,2),M=v[0],k=v[1],g=u;b<5.4&&b>=4.8&&6===u&&(g=u+1);var p=Z(g,1,c),m=(0,i.A)(p,1)[0];h={"color.text.brand":g,"color.icon.brand":u,"color.background.brand.subtlest":0,"color.background.brand.subtlest.hovered":1,"color.background.brand.subtlest.pressed":2,"color.background.brand.bold":u,"color.background.brand.bold.hovered":M,"color.background.brand.bold.pressed":k,"color.background.brand.boldest":9,"color.background.brand.boldest.hovered":8,"color.background.brand.boldest.pressed":7,"color.border.brand":u,"color.text.selected":g,"color.icon.selected":u,"color.background.selected.bold":u,"color.background.selected.bold.hovered":M,"color.background.selected.bold.pressed":k,"color.border.selected":u,"color.link":g,"color.link.pressed":m,"color.chart.brand":5,"color.chart.brand.hovered":6,"color.background.selected":0,"color.background.selected.hovered":1,"color.background.selected.pressed":2}}else{var w=6;b<4.5&&b>=4&&6===u&&(w=a),h={"color.background.brand.subtlest":0,"color.background.brand.subtlest.hovered":1,"color.background.brand.subtlest.pressed":2,"color.background.brand.bold":w,"color.background.brand.bold.hovered":7,"color.background.brand.bold.pressed":8,"color.background.brand.boldest":9,"color.background.brand.boldest.hovered":8,"color.background.brand.boldest.pressed":7,"color.border.brand":6,"color.background.selected.bold":w,"color.background.selected.bold.hovered":7,"color.background.selected.bold.pressed":8,"color.text.brand":6,"color.icon.brand":6,"color.chart.brand":5,"color.chart.brand.hovered":6,"color.text.selected":6,"color.icon.selected":6,"color.border.selected":6,"color.background.selected":0,"color.background.selected.hovered":1,"color.background.selected.pressed":2,"color.link":6,"color.link.pressed":7}}if("light"===r)return{light:h};if(Object.entries(h).forEach((function(t){var r=(0,i.A)(t,2),e=r[0],n=r[1];d[e]=9-("string"==typeof n?u:n)})),b<4.5){var y=s["color.text.inverse"];(0,l.eM)(y,t)>=4.5&&u>=2&&(d["color.background.brand.bold"]=u,d["color.background.brand.bold.hovered"]=u-1,d["color.background.brand.bold.pressed"]=u-2)}return"dark"===r?{dark:d}:{light:h,dark:d}}(t,r,n),a={};return Object.entries(o).forEach((function(t){var r=(0,i.A)(t,2),e=r[0],o=r[1];"light"!==e&&"dark"!==e||(a[e]=Y(Y({},o),function(t){var r=t.customThemeTokenMap,e=t.mode,n=t.themeRamp,o={},a=Object.keys(r);return d.forEach((function(t){var c=t.backgroundLight,i=t.backgroundDark,u=t.foreground,s=t.desiredContrast,h=t.updatedTokens,d="light"===e?c:i,f=r[u],v=r[d],M=a.includes(u)?"string"==typeof f?f:n[f]:b(u,e),k=a.includes(d)?"string"==typeof v?v:n[v]:b(d,e);(0,l.eM)(M,k)<=s&&h.forEach((function(t){var n=r[t];"number"==typeof n&&(o[t]="light"===e?n+1:n-1)}))})),o}({customThemeTokenMap:o,mode:e,themeRamp:n})))})),a},K=e(99126),Q=10;function $(t){var r,e=null==t||null===(r=t.UNSAFE_themeOptions)||void 0===r?void 0:r.brandColor,c=(null==t?void 0:t.colorMode)||o.rV.colorMode,i=JSON.stringify(null==t?void 0:t.UNSAFE_themeOptions),u=(0,K.t)(i),s=X(e).ramp,l=[],h=W(e,c,s);return"light"!==c&&"auto"!==c||!h.light||l.push({id:"light",attrs:{"data-theme":"light","data-custom-theme":u},css:"\nhtml[".concat(n.Xm,'="').concat(u,'"][').concat(n.LZ,'="light"][data-theme~="light:light"] {\n  /* Branded tokens */\n    ').concat((0,a.U8)(h.light,s),"\n}")}),"dark"!==c&&"auto"!==c||!h.dark||l.push({id:"dark",attrs:{"data-theme":"dark","data-custom-theme":u},css:"\nhtml[".concat(n.Xm,'="').concat(u,'"][').concat(n.LZ,'="dark"][data-theme~="dark:dark"] {\n  /* Branded tokens */\n    ').concat((0,a.U8)(h.dark,s),"\n}")}),l}function tt(t){var r=$(t);(0,a.L3)(Q),r.map((function(t){var r=document.createElement("style");document.head.appendChild(r),r.dataset.theme=t.attrs["data-theme"],r.dataset.customTheme=t.attrs["data-custom-theme"],r.textContent=t.css}))}}}]);