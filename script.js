"use strict";
/**
 * THE VOWEL LAB
 * Listening, speaking and pronunciation practice built on Chapter 4,
 * "The Vowel System" (The Sound System of North American English).
 *
 * Flow: STUDY -> DRILL -> RECORD -> EXAM.
 * The figure is a recreation of the book's Figure 4.1 (the NAE vowel quadrant
 * superimposed on a sagittal section), carrying the tongue contours of
 * Figure 4.2, the glide arrows of Figure 4.5 and the lip plates of Figure 4.3.
 */

/* ============================================================================
   0. CONFIG — the only lines you normally need to edit
   ========================================================================== */
const CONFIG = {
  /* The deployed Apps Script web app for the Vowel Lab.
     Empty this string and the Send buttons simply stay hidden. */
  endpoint: 'https://script.google.com/macros/s/AKfycbxTvKebIEZzsTcK1psHRYfrse4_wPiwE4p--s-NtlGWzQD22oMC4qFxvNbbJseCc8aS/exec',
  maxClipSeconds: 20,

  /* Score needed to clear one activity. 0.9 = 9 correct out of 10. */
  passMark: 0.9,

  /* Units open one at a time: unit 2 stays locked until every activity in
     unit 1 is cleared, and so on. Set to false to open all ten at once. */
  lockUnits: true,

  /* How many units must be cleared before the final exam opens. */
  examAfter: 10,
};

/* ============================================================================
   1. THE VOWELS  (Chapter 4, pp. 115-133)
   fx: front 0 -> back 1 ; fy: high 0 -> low 1
   lip: which plate of Figure 4.3 applies (1 spread ... 5 tightly rounded)
   ========================================================================== */
const V = {
  iy:{ipa:'iy', ipaAlt:'iː', name:'high front tense', fx:.13, fy:.08, jaw:.06, lip:1, tense:1,
      words:['heat','be','free','deed','beam','bee','me','tree'],
      how:'Tongue high and pushed forward, jaw almost closed, lips spread into a wide smile. The /y/ glide is easiest to hear in open syllables — bee, me, tree.',
      glide:[.02,-.03],
      spellings:[{p:'ee',e:'see, feet, green'},{p:'ea',e:'eat, meat, please'},{p:'e / e_e',e:'be, these, complete'},{p:'ie / ei',e:'field, receive'},{p:'-y (stressed)',e:'key, city'}]},
  I :{ipa:'ɪ', ipaAlt:'ɪ', name:'high front lax', fx:.28, fy:.26, jaw:.18, lip:2, tense:0,
      words:['fit','tin','pin','sit','bit','ship','live','rich'],
      how:'Relax the muscles from /iy/: the jaw drops a little, the lips spread less, the tongue moves toward the centre. No glide at all.',
      spellings:[{p:'i',e:'sit, thin, milk'},{p:'y',e:'gym, myth, system'},{p:'ui / e',e:'build, pretty'},{p:'-age / -ate (reduced)',e:'village, climate'}]},
  ey:{ipa:'ey', ipaAlt:'eɪ', name:'mid front tense', fx:.07, fy:.42, jaw:.34, lip:2, tense:1,
      words:['rain','may','great','trade','ray','pain','late','name'],
      how:'Start lower and less spread than /iy/, then let the tongue ride up toward the /y/ glide. Two symbols because it is two movements.',
      glide:[-.07,-.42],
      spellings:[{p:'a_e',e:'name, late, made'},{p:'ai / ay',e:'rain, day, plain'},{p:'ei / eigh',e:'vein, eight, weigh'},{p:'ea',e:'great, break, steak'}]},
  E :{ipa:'ɛ', ipaAlt:'e', name:'mid front lax', fx:.21, fy:.50, jaw:.50, lip:2, tense:0,
      words:['get','hen','bet','bed','red','said','men','dress'],
      how:'Jaw fairly still in mid position, lips only slightly spread, tongue more central than /ey/. No glide.',
      spellings:[{p:'e',e:'bed, red, tell'},{p:'ea',e:'bread, head, weather'},{p:'ai / ay',e:'said, says'},{p:'ie / a',e:'friend, many'}]},
  ae:{ipa:'æ', ipaAlt:'æ', name:'low front lax', fx:.08, fy:.91, jaw:.80, lip:3, tense:0,
      words:['cat','pan','hat','bad','man','back','laugh','ask'],
      how:'From /ɛ/, drop the tongue and jaw further and spread the lips more. Speakers who learned British English often replace it with /ɑ/ in class, fast, chance, passed.',
      spellings:[{p:'a',e:'cat, hand, plan'},{p:'au',e:'laugh, aunt'},{p:'ai',e:'plaid'}]},
  a :{ipa:'ɑ', ipaAlt:'ɑː', name:'low central tense', fx:.50, fy:.95, jaw:1.0, lip:3, tense:1,
      words:['ma','hot','clock','spa','pot','father','stop','job'],
      how:'The sound a doctor asks for — "aahh". Jaw at its most open, tongue lying flat and low, lips neither rounded nor spread.',
      spellings:[{p:'o',e:'hot, stop, box'},{p:'a',e:'father, calm, spa'},{p:'ea / augh',e:'heart, ah'}]},
  V_:{ipa:'ʌ', ipaAlt:'ʌ', name:'low mid-central lax', fx:.48, fy:.64, jaw:.52, lip:2, tense:0,
      words:['cut','son','fun','but','luck','done','love','up'],
      how:'Jaw, lips and tongue all relaxed and central. Higher and slightly further forward than /ɑ/; lower and further back than /ɛ/.',
      spellings:[{p:'u',e:'cut, sun, must'},{p:'o',e:'son, love, done'},{p:'ou',e:'country, young, touch'},{p:'oo',e:'blood, flood'}]},
  O :{ipa:'ɔ', ipaAlt:'ɔː', name:'low back tense', fx:.82, fy:.85, jaw:.70, lip:4, tense:1,
      words:['thought','law','caught','dawn','tall','bought','saw','fall'],
      how:'From /ɑ/, the jaw rises, the tongue moves back and the lips round. Many speakers in the US and Canada do not separate this from /ɑ/ at all.',
      spellings:[{p:'aw / au',e:'law, caught, autumn'},{p:'ough / augh',e:'bought, taught'},{p:'al',e:'tall, walk, salt'},{p:'o',e:'dog, long, off'}]},
  ow:{ipa:'ow', ipaAlt:'oʊ', name:'mid back tense', fx:.92, fy:.55, jaw:.40, lip:5, tense:1,
      words:['sew','boat','toe','go','home','know','coat','slow'],
      how:'Begins in mid position and glides up toward /w/. The lips close like a camera shutter: fully rounded and open, then tightly rounded.',
      glide:[.11,-.42],
      spellings:[{p:'o / o_e',e:'go, home, note'},{p:'oa',e:'boat, coat, road'},{p:'ow',e:'know, slow, show'},{p:'ough',e:'though, dough'}]},
  U :{ipa:'ʊ', ipaAlt:'ʊ', name:'high back lax', fx:.78, fy:.26, jaw:.18, lip:4, tense:0,
      words:['look','wool','book','could','put','good','took','foot'],
      how:'Start from the tense rounded position of /uw/, then loosen the muscles and relax the rounding. Lower, more centred, less rounded. No glide.',
      spellings:[{p:'oo',e:'book, good, foot'},{p:'u',e:'put, full, push'},{p:'ou',e:'could, would, should'},{p:'o',e:'wolf, woman'}]},
  uw:{ipa:'uw', ipaAlt:'uː', name:'high back tense', fx:.93, fy:.09, jaw:.06, lip:5, tense:1,
      words:['blue','room','boot','zoo','Luke','food','true','moon'],
      how:'Back of the tongue very high, lips tightly rounded — the position for a kiss. The /w/ glide is clearest in open syllables such as zoo.',
      glide:[.01,-.03],
      spellings:[{p:'oo',e:'food, moon, soon'},{p:'u_e / ue',e:'rule, blue, true'},{p:'ou',e:'soup, group, you'},{p:'ew / o',e:'new, do, who'}]},
  er:{ipa:'ɝ', ipaAlt:'ɜr', name:'r-coloured mid-central', fx:.47, fy:.44, jaw:.40, lip:4, tense:1,
      words:['bird','hurt','word','learn','girl','nurse','first','turn'],
      how:'When /ʌ/ is followed by /r/ the quality changes so much that it needs its own symbol. The tongue bunches and takes on the retroflex colour of /r/ all the way through the vowel.',
      spellings:[{p:'ir',e:'bird, first, girl'},{p:'ur',e:'hurt, turn, nurse'},{p:'er',e:'her, term, serve'},{p:'ear / or',e:'learn, word, work'}]},
  ay:{ipa:'ay', ipaAlt:'aɪ', name:'diphthong: low central → high front', fx:.45, fy:.98, jaw:.95, lip:3, tense:1, diph:1, to:[.13,.08],
      words:['pie','fine','my','height','bite','time','ice','write'],
      how:'Open wide for /ɑ/, then let the jaw and tongue rise and the lips spread as you move toward /iy/. One long gliding movement, not two vowels.',
      spellings:[{p:'i_e',e:'time, nice, write'},{p:'y / ye',e:'my, try, dye'},{p:'igh',e:'high, night, light'},{p:'ei / ie',e:'height, tie, pie'}]},
  aw:{ipa:'aw', ipaAlt:'aʊ', name:'diphthong: low central → high back', fx:.45, fy:.98, jaw:.95, lip:3, tense:1, diph:1, to:[.93,.09],
      words:['blouse','how','bout','town','loud','now','house','out'],
      how:'Start from the same open position as /ay/, but this time the lips round as the tongue rises toward /uw/.',
      spellings:[{p:'ou',e:'out, loud, house'},{p:'ow',e:'how, town, brown'}]},
  oy:{ipa:'ɔy', ipaAlt:'ɔɪ', name:'diphthong: low back → high front', fx:.82, fy:.85, jaw:.70, lip:4, tense:1, diph:1, to:[.13,.08],
      words:['boy','choice','coin','oil','joy','noise','point','toy'],
      how:'Begin at the lowest back vowel /ɔ/ with rounded lips, then glide forward and up toward /iy/, spreading the lips as you go.',
      spellings:[{p:'oi',e:'oil, coin, noise'},{p:'oy',e:'boy, toy, enjoy'}]},
};
const ORDER = ['iy','I','ey','E','ae','a','V_','O','ow','U','uw','er','ay','aw','oy'];

/* ============================================================================
   2. THE TEN CONTRAST UNITS
   Ordered by the relative functional load table (Table 4.15, p. 160).
   ========================================================================== */
const UNITS = [
  { id:'u1', a:'iy', b:'I', title:'Beat or bit?', rfl:'95%',
    blurb:'The highest-load vowel contrast in English after /ɪ/–/æ/. Learners from languages without glided vowels often produce something midway between the two.',
    pairs:[['beat','bit'],['keen','kin'],['peel','pill'],['sleep','slip'],['feel','fill'],
           ['leave','live'],['seat','sit'],['cheap','chip'],['green','grin'],['heat','hit'],
           ['each','itch'],['deed','did']],
    sents:[['Don\'t sleep on the floor.','Don\'t slip on the floor.'],
           ['He beat the man.','He bit the man.'],
           ['Will he leave here?','Will he live here?'],
           ['I need a green pen.','I need a grin, Ben.']] },

  { id:'u2', a:'ey', b:'E', title:'Bait or bet?', rfl:'42.5%',
    blurb:'A common learner error. /ey/ is tense, longer, higher and ends in a glide; /ɛ/ is lax, lower and still.',
    pairs:[['bait','bet'],['Jane','Jen'],['tale','tell'],['late','let'],['main','men'],
           ['pain','pen'],['sale','sell'],['wait','wet'],['taste','test'],['mate','met'],
           ['pale','pell'],['raid','red']],
    sents:[['She sells the tale.','She sells the tell.'],
           ['Did you get the mail?','Did you get the mel?'],
           ['They came late.','They came, let.'],
           ['The main office is closed.','The men office is closed.']] },

  { id:'u3', a:'E', b:'ae', title:'Bet or bat?', rfl:'42%',
    blurb:'Adjacent on the quadrant, so easily confused. Put a hand on your jaw: it drops for /æ/ and stays put for /ɛ/.',
    pairs:[['bet','bat'],['men','man'],['sell','Sal'],['pen','pan'],['said','sad'],
           ['dead','dad'],['guess','gas'],['lend','land'],['met','mat'],['less','lass'],
           ['bed','bad'],['head','had']],
    sents:[['I need a pen.','I need a pan.'],
           ['He met the mat.','He mat the met.'],
           ['Heather has seven happy hens in the back pen.','Heather has seven happy hens in the back pan.'],
           ['They said it was sad.','They sad it was said.']] },

  { id:'u4', a:'ae', b:'a', title:'Cat or cot?', rfl:'66%',
    blurb:'/ɑ/ is a frequent substitute for /æ/, which does not exist in many first languages. Spread the lips more for /æ/; drop the jaw more for /ɑ/.',
    pairs:[['cat','cot'],['hat','hot'],['cap','cop'],['sack','sock'],['pat','pot'],
           ['rack','rock'],['black','block'],['tap','top'],['bat','bought'],['ban','bon'],
           ['add','odd'],['map','mop']],
    sents:[['There is a cat here.','There is a cot here.'],
           ['Put on your hat.','Put on your hot.'],
           ['He has a black cap.','He has a block cop.'],
           ['She grew up on a farm with a cat.','She grew up on a farm with a cot.']] },

  { id:'u5', a:'V_', b:'a', title:'Cut or cot?', rfl:'61%',
    blurb:'Most languages have no mid-central vowel, so /ʌ/ is hard to hear and hard to say. Start with the jaw low for /ɑ/, then raise it slightly.',
    pairs:[['cut','cot'],['done','Don'],['dull','doll'],['nut','not'],['luck','lock'],
           ['cup','cop'],['hut','hot'],['sung','song'],['bum','bomb'],['buck','bock'],
           ['stuck','stock'],['rub','rob']],
    sents:[['He gave me a hug.','He gave me a hog.'],
           ['That\'s my luck.','That\'s my lock.'],
           ['I fell over a rug.','I fell over a rock.'],
           ['The cup is gone.','The cop is gone.']] },

  { id:'u6', a:'a', b:'O', title:'Cot or caught?', rfl:'dialectal',
    blurb:'Many NAE speakers merge these two completely. Learn to recognise the difference even if you do not produce it — and know which is used where you live.',
    pairs:[['cot','caught'],['Don','dawn'],['collar','caller'],['stock','stalk'],['tot','taught'],
           ['hock','hawk'],['odd','awed'],['pond','pawned'],['cod','cawed'],['sod','sawed'],
           ['not','naught'],['chock','chalk']],
    sents:[['He bought a cot.','He bought a caught.'],
           ['Don came at dawn.','Dawn came at Don.'],
           ['The collar is missing.','The caller is missing.'],
           ['She taught in a tot class.','She tot in a taught class.']] },

  { id:'u7', a:'O', b:'ow', title:'Bought or boat?', rfl:'88%',
    blurb:'The third-highest load of all the vowel contrasts. /ow/ carries a /w/ glide with progressive lip rounding; /ɔ/ does not glide.',
    pairs:[['bought','boat'],['caught','coat'],['fawn','phone'],['ball','bowl'],['lawn','loan'],
           ['hall','hole'],['tall','toll'],['call','coal'],['law','low'],['saw','sew'],
           ['fall','foal'],['naught','note']],
    sents:[['There was an ugly ball in the corner.','There was an ugly bowl in the corner.'],
           ['He wanted to sell the lawn.','He wanted to sell the loan.'],
           ['The hall is dark.','The hole is dark.'],
           ['I saw it.','I sew it.']] },

  { id:'u8', a:'U', b:'uw', title:'Look or Luke?', rfl:'few pairs',
    blurb:'Fewer minimal pairs than /iy/–/ɪ/, so fewer breakdowns — but the contrast still marks an accent. /ʊ/ lives in could, would, should and in verbs ending in /k/.',
    pairs:[['would','wooed'],['look','Luke'],['pull','pool'],['full','fool'],['could','cooed'],
           ['soot','suit'],['stood','stewed'],['foot','food'],['hood','who\'d'],['should','shooed'],
           ['book','boot'],['took','toot']],
    sents:[['June took a good look at Luke\'s cool pool.','June took a good luke at look\'s cool pull.'],
           ['It\'s full.','It\'s fool.'],
           ['He would go.','He wooed go.'],
           ['Pull the rope.','Pool the rope.']] },

  { id:'u9', a:'ay', b:'ey', title:'The diphthongs', rfl:'—',
    blurb:'/ay aw ɔy/ move much further across the mouth than /ey ow/. Learners often flatten them into the nearest tense vowel. This unit mixes all three diphthongs against the tense vowel each one is confused with.',
    pairs:[['might','mate','ay','ey'],['mine','main','ay','ey'],['mile','mail','ay','ey'],
           ['bite','bait','ay','ey'],['ride','raid','ay','ey'],
           ['bout','boat','aw','ow'],['town','tone','aw','ow'],['towel','toll','aw','ow'],
           ['loud','load','aw','ow'],['how','hoe','aw','ow'],
           ['Lloyd','laud','ɔy','ɔ'],['boil','ball','ɔy','ɔ'],['coy','caw','ɔy','ɔ']],
    sents:[['It was a long ride.','It was a long raid.'],
           ['Look at that town.','Look at that tone.'],
           ['The boy has a choice.','The buoy has a chose.'],
           ['I like the white tile.','I like the wait tale.']] },

  { id:'u10', a:'er', b:'V_', title:'r-colouring and reduced vowels', rfl:'—',
    blurb:'When /r/ follows a vowel in the same syllable it colours it, and some contrasts disappear altogether. Unstressed syllables reduce to schwa.',
    pairs:[['hut','hurt','ʌ','ɝ'],['bud','bird','ʌ','ɝ'],['fed','fared','ɛ','ɛr'],
           ['pot','part','ɑ','ɑr'],['caught','court','ɔ','ɔr'],['mid','mirror','ɪ','ɪr'],
           ['tie','tire','ay','ayr'],['bead','beard','iy','ɪr'],['should','assured','ʊ','ʊr'],
           ['pool','poor','uw','ʊr'],['load','lord','ow','ɔr'],['bud','bird','ʌ','ɝ']],
    sents:[['He hurt his hand.','He hut his hand.'],
           ['The bird is in the yard.','The bud is in the yard.'],
           ['Our flour is on the floor.','Are flower is on the flow.'],
           ['She is a lawyer.','She is a law year.']] },
];

/* ============================================================================
   3. THE FIGURE — a recreation of Figure 4.1
   ========================================================================== */
const FIG = (() => {
  /* Corners and dividers traced from Figure 4.1. The left edge and the
     front|central divider slant at different angles — the front column
     narrows sharply toward the bottom because the tongue cannot reach as
     far forward when it is low. */
  const G = { tl:[252,152], tr:[664,152], br:[664,452], bl:[444,452] };
  const DIV_FC = [[414,152],[502,452]];   // front | central  (slanted)
  const DIV_CB = 567;                     // central | back   (vertical)
  function gp(fx,fy){
    const tx=G.tl[0]+(G.tr[0]-G.tl[0])*fx, ty=G.tl[1]+(G.tr[1]-G.tl[1])*fx;
    const bx=G.bl[0]+(G.br[0]-G.bl[0])*fx, by=G.bl[1]+(G.br[1]-G.bl[1])*fx;
    return [tx+(bx-tx)*fy, ty+(by-ty)*fy];
  }
  function cub(t,p0,p1,p2,p3){const u=1-t;
    return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],
            u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]];}
  const PAL=(()=>{const o=[];
    for(let i=0;i<=40;i++)o.push(cub(i/40,[250,150],[342,92],[462,78],[562,102]));
    for(let i=1;i<=40;i++)o.push(cub(i/40,[562,102],[652,124],[708,182],[728,256]));
    return o;})();
  function palY(x){
    if(x<=PAL[0][0])return PAL[0][1];
    if(x>=PAL[PAL.length-1][0])return PAL[PAL.length-1][1];
    for(let i=0;i<PAL.length-1;i++){const[a,b]=PAL[i],[c,d]=PAL[i+1];
      if(x>=a&&x<=c)return b+(d-b)*((x-a)/((c-a)||1));}
    return 110;
  }
  function tongue(fx,fy,jaw){
    let [ax,ay]=gp(fx,fy);
    ay=Math.max(ay,palY(ax)+22);
    const tipX=186+fx*16, tipY=296+jaw*46, rX=700, rY=452;
    return `M ${tipX} ${tipY} C ${tipX+(ax-tipX)*.42} ${tipY-(tipY-ay)*.22} `+
           `${ax-(ax-tipX)*.34} ${ay+(tipY-ay)*.14} ${ax} ${ay} `+
           `C ${ax+(rX-ax)*.30} ${ay+(rY-ay)*.05} ${ax+(rX-ax)*.72} ${ay+(rY-ay)*.42} ${rX} ${rY}`;
  }
  const LIP = {1:{rw:52,rh:11,t:'extreme spread'},2:{rw:44,rh:20,t:'less spread, more open'},
               3:{rw:40,rh:38,t:'most open'},4:{rw:28,rh:24,t:'rounded'},5:{rw:16,rh:14,t:'tightly rounded'}};

  /* browser-safe halo: a stroke-only copy underneath the filled copy */
  function lab(x,y,txt,anchor){
    const a = anchor ? ` text-anchor="${anchor}"` : '';
    return `<text x="${x}" y="${y}"${a} stroke="#100D0B" stroke-width="6" stroke-linejoin="round" fill="none">${txt}</text>`+
           `<text x="${x}" y="${y}"${a} fill="#9C8A7E">${txt}</text>`;
  }

  function render(key){
    const s = V[key]; if(!s) return '';
    const [px,py] = gp(s.fx,s.fy);
    const L = LIP[s.lip];

    let ghosts='';
    for(const k of ORDER){
      if(k===key || V[k].diph) continue;
      ghosts += `<path d="${tongue(V[k].fx,V[k].fy,V[k].jaw)}" fill="none" stroke="#6B5A50" stroke-width="1.2" stroke-dasharray="5 6" opacity=".26"/>`;
    }
    let pts='';
    for(const k of ORDER){
      const t=V[k]; if(t.diph) continue;
      const [x,y]=gp(t.fx,t.fy), on=(k===key);
      if(on) pts+=`<circle cx="${x}" cy="${y-5}" r="23" fill="none" stroke="#FFC94A" stroke-width="2" opacity=".6"/>`;
      pts+=`<text x="${x}" y="${y}" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-style="italic" `+
           `font-size="${on?27:19}" fill="${on?'#FFC94A':'#B8A695'}" opacity="${on?1:.8}">${t.ipa}</text>`;
    }
    let arrow='';
    if(s.diph) arrow += `<circle cx="${px}" cy="${py-6}" r="7" fill="#FFC94A"/>`;
    const target = s.diph ? s.to : (s.glide ? [Math.min(1,s.fx+s.glide[0]),Math.max(0,s.fy+s.glide[1])] : null);
    if(target){
      const b=gp(target[0],target[1]);
      if(Math.hypot(b[0]-px,b[1]-py)>18)
        arrow=`<path d="M ${px} ${py-6} L ${b[0]} ${b[1]+9}" stroke="#FFC94A" stroke-width="${s.diph?3:2.4}" marker-end="url(#ah)"/>`;
    }

    return `<svg viewBox="0 0 900 600" role="img" aria-label="Vowel quadrant showing ${s.ipa}">
<defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
  <path d="M0 0 L10 5 L0 10 Z" fill="#FFC94A"/></marker></defs>

<g fill="none" stroke="#CDBBA9" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M 128 44 C 112 78 96 104 74 128 C 62 141 66 152 84 154 L 120 156"/>
  <path d="M 96 132 C 108 128 118 134 116 146" stroke-width="2"/>
  <path d="M 120 156 C 140 162 150 176 148 192 C 158 190 176 182 196 176 L 252 152"/>
  <path d="M 152 232 C 136 240 126 256 130 272 C 114 280 102 300 106 322 C 110 344 128 362 156 374"/>
  <path d="M 156 374 C 210 398 280 424 360 442"/>
  <path d="M 250 150 C 342 92 462 78 562 102 C 652 124 708 182 728 256"/>
</g>

<path d="M ${G.tl} L ${G.tr} L ${G.br} L ${G.bl} Z" fill="none" stroke="#8A7364" stroke-width="1.8"/>
<g fill="none" stroke="#8A7364" stroke-width="1.1" opacity=".6">
  <path d="M ${DIV_FC[0]} L ${DIV_FC[1]}"/>
  <path d="M ${DIV_CB} 152 L ${DIV_CB} 452"/>
  <path d="M ${gp(0,1/3)} L 664 252"/>
  <path d="M ${gp(0,2/3)} L 664 352"/>
</g>

${ghosts}
<path class="fig-tongue" d="${tongue(s.fx,s.fy,s.jaw)}" fill="none" stroke="#E4572E" stroke-width="3.6" stroke-linecap="round"/>
${arrow}${pts}

<g font-family="Karla,sans-serif" font-size="17" letter-spacing="1">
  ${lab(333,132,'front','middle')}${lab(490,132,'central','middle')}${lab(615,132,'back','middle')}
  ${lab(gp(0,.17)[0]-20, gp(0,.17)[1]+6, 'high','end')}
  ${lab(gp(0,.50)[0]-20, gp(0,.50)[1]+6, 'mid','end')}
  ${lab(gp(0,.84)[0]-20, gp(0,.84)[1]+6, 'low','end')}
</g>
<g stroke="#9C8A7E" stroke-width="1.6" fill="none">
  <path d="M 762 168 L 762 436"/><path d="M 756 176 L 762 164 L 768 176"/><path d="M 756 428 L 762 440 L 768 428"/>
</g>
<text x="786" y="302" fill="#9C8A7E" font-family="Karla,sans-serif" font-size="14"
      transform="rotate(90 786 302)" text-anchor="middle">tongue rises and drops</text>

<g transform="translate(824 486)">
  <ellipse rx="${L.rw}" ry="${L.rh}" fill="#1C1210" stroke="#E4572E" stroke-width="3.2"/>
  <text y="${L.rh+24}" text-anchor="middle" fill="#9C8A7E" font-family="JetBrains Mono,monospace" font-size="12">lips ${s.lip}</text>
</g>
</svg>`;
  }
  return { render, lipText:(n)=>LIP[n].t };
})();

/* ============================================================================
   4. AUDIO — words and sentences only, never a bare symbol
   ========================================================================== */
const Audio_ = {
  voices:[], voice:null, rate:0.9,
  init(){
    const load=()=>{
      this.voices = speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));
      const sel=document.getElementById('voice'); if(!sel) return;
      sel.innerHTML = this.voices.map((v,i)=>`<option value="${i}">${v.name} (${v.lang})</option>`).join('');
      const pref = this.voices.findIndex(v=>/natural|premium|enhanced|samantha|google us/i.test(v.name));
      sel.value = pref>=0?pref:0; this.voice = this.voices[sel.value] || null;
      sel.onchange = ()=>{ this.voice = this.voices[sel.value]; };
    };
    load(); speechSynthesis.onvoiceschanged = load;
    const r=document.getElementById('rate'), rv=document.getElementById('rate-val');
    if(r) r.oninput=()=>{ this.rate=parseFloat(r.value); rv.textContent=this.rate.toFixed(2); };
  },
  say(text, slow){
    if(!('speechSynthesis' in window)) { toast('This browser has no speech support.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if(this.voice) u.voice=this.voice;
    u.rate = slow ? Math.max(.5,this.rate-0.28) : this.rate;
    u.pitch = 1; u.lang = this.voice ? this.voice.lang : 'en-US';
    speechSynthesis.speak(u);
    return u;
  }
};

/* ============================================================================
   5. RECORDER
   ========================================================================== */
const Rec = {
  stream:null, mr:null, chunks:[], timer:null, raf:null, ctx:null, analyser:null,
  async start(onLevel, onStop){
    try{
      if(!this.stream) this.stream = await navigator.mediaDevices.getUserMedia({audio:true});
    }catch(e){ toast('Microphone permission was refused.'); return false; }
    this.chunks=[];
    this.mr = new MediaRecorder(this.stream);
    this.mr.ondataavailable = e => { if(e.data.size) this.chunks.push(e.data); };
    this.mr.onstop = () => {
      const blob = new Blob(this.chunks,{type:this.mr.mimeType||'audio/webm'});
      onStop(blob);
      cancelAnimationFrame(this.raf); clearTimeout(this.timer);
    };
    this.mr.start();
    if(!this.ctx){
      this.ctx = new (window.AudioContext||window.webkitAudioContext)();
      const src = this.ctx.createMediaStreamSource(this.stream);
      this.analyser = this.ctx.createAnalyser(); this.analyser.fftSize=512;
      src.connect(this.analyser);
    }
    const buf = new Uint8Array(this.analyser.frequencyBinCount);
    const tick = () => {
      this.analyser.getByteTimeDomainData(buf);
      let peak=0; for(const b of buf) peak=Math.max(peak,Math.abs(b-128));
      onLevel(Math.min(100, (peak/128)*180));
      this.raf = requestAnimationFrame(tick);
    };
    tick();
    this.timer = setTimeout(()=>this.stop(), CONFIG.maxClipSeconds*1000);
    return true;
  },
  stop(){ if(this.mr && this.mr.state==='recording') this.mr.stop(); }
};

/* ============================================================================
   6. STATE
   ========================================================================== */
/* Progress has to survive a reload, or a student who refreshes is locked back
   out of every unit. localStorage is feature-detected: where it is blocked
   (private windows, sandboxed frames) the app still runs, it just forgets
   between sessions. */
const Store = (()=>{
  const KEY='vowel-lab-progress-v1';
  let ok=false;
  try{ localStorage.setItem(KEY+'-t','1'); localStorage.removeItem(KEY+'-t'); ok=true; }catch(e){ ok=false; }
  return {
    ok,
    load(){ if(!ok) return null; try{ return JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){ return null; } },
    save(v){ if(!ok) return; try{ localStorage.setItem(KEY, JSON.stringify(v)); }catch(e){} },
    wipe(){ if(!ok) return; try{ localStorage.removeItem(KEY); }catch(e){} }
  };
})();

const State = { done:{}, scores:{}, clips:{} };
(function restore(){
  const saved = Store.load();
  if(saved){ State.done = saved.done || {}; State.scores = saved.scores || {}; }
})();
/* clips hold Blobs, which do not serialise — recordings stay session-only */
function saveProgress(){ Store.save({ done:State.done, scores:State.scores }); }
const $ = s => document.querySelector(s);
const main = () => document.getElementById('main');
let autoPlayTimer = null;
let studioUnit = null;

function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.hidden=false;
  clearTimeout(t._t); t._t=setTimeout(()=>{t.hidden=true},3200);
}
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
function pick(a,n){ return shuffle(a).slice(0,n); }
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function playIcon(){ return '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; }
function unitDoneCount(u){ return ACTS.filter(a=>State.done[u.id+':'+a.id]).length; }
function unitCleared(u){ return unitDoneCount(u) === ACTS.length; }
function unitIndex(id){ return UNITS.findIndex(u=>u.id===id); }
function clearedCount(){ return UNITS.filter(unitCleared).length; }
/* a unit opens when the one before it is fully cleared */
function unitUnlocked(i){
  if(!CONFIG.lockUnits || i<=0) return true;
  return unitCleared(UNITS[i-1]);
}
function examUnlocked(){ return clearedCount() >= CONFIG.examAfter; }
function lockIcon(){ return '<svg viewBox="0 0 24 24" width="13" height="13" style="vertical-align:-1px"><path fill="currentColor" d="M17 9V7a5 5 0 0 0-10 0v2H5v13h14V9h-2zM9 7a3 3 0 0 1 6 0v2H9V7zm4 9.7V19h-2v-2.3a2 2 0 1 1 2 0z"/></svg>'; }

function setView(html){
  clearTimeout(autoPlayTimer); autoPlayTimer=null;
  speechSynthesis.cancel();
  main().innerHTML = html;
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ============================================================================
   7. VIEWS
   ========================================================================== */
function viewHome(){
  const pc = Math.round(CONFIG.passMark*100);
  const cards = UNITS.map((u,i)=>{
    const A=V[u.a], B=V[u.b], n=unitDoneCount(u), open=unitUnlocked(i);

    if(!open){
      const prev = UNITS[i-1], left = ACTS.length - unitDoneCount(prev);
      return `<div class="card locked" aria-disabled="true">
        <div class="tags">
          <span class="tag">Unit ${i+1}</span>
          <span class="tag lock">${lockIcon()} locked</span>
        </div>
        <p class="pair-ipa">${A.ipa}<span class="vs">vs</span>${B.ipa}</p>
        <h3>${esc(u.title)}</h3>
        <p class="muted" style="font-size:.92rem;margin:0">
          Clear Unit ${i} first — ${left} activit${left===1?'y':'ies'} still to pass at ${pc}%.</p>
      </div>`;
    }

    return `<button class="card link ${n===ACTS.length?'done':''}" data-unit="${u.id}">
      <div class="tags">
        <span class="tag">Unit ${i+1}</span>
        <span class="tag ${A.tense?'tense':'lax'}">${A.tense?'tense':'lax'}</span>
        <span class="tag ${B.tense?'tense':'lax'}">${B.tense?'tense':'lax'}</span>
        ${n===ACTS.length?'<span class="tag ok">cleared</span>'
          :n?`<span class="tag ok">${n}/${ACTS.length} done</span>`
             :'<span class="tag" style="color:var(--amber);border-color:rgba(255,201,74,.45)">open</span>'}
      </div>
      <p class="pair-ipa"><span style="color:var(--tense)">${A.ipa}</span><span class="vs">vs</span><span style="color:var(--lax)">${B.ipa}</span></p>
      <h3>${esc(u.title)}</h3>
      <p class="muted" style="font-size:.92rem;margin:0">${esc(u.blurb)}</p>
    </button>`;
  }).join('');

  const cleared = clearedCount();
  const need = CONFIG.examAfter - cleared;
  setView(`
    <p class="kicker">The Vowel System · Chapter 4</p>
    <h1>Fourteen vowels, <em>one map</em>.</h1>
    <p class="lede">North American English has at least fourteen stressed vowels — fifteen once /r/-colouring is counted. They are not distinguished by contact between the articulators, the way consonants are, but by where the tongue sits, how far the jaw opens, and what the lips do. Study the map first, then prove you can hear it.</p>

    <div class="row">
      <button class="btn" data-go="lab">Open the Sound Lab</button>
      <button class="btn sec" data-go="exam" ${examUnlocked()?'':'disabled'}>
        ${examUnlocked()?'Take the final exam':`Final exam — ${need} unit${need>1?'s':''} to go`}
      </button>
    </div>

    <section class="sec">
      <div class="sec-head"><h2>How to work through this</h2></div>
      <div class="grid g2">
        <div class="card"><h3>1 · Study</h3><p class="muted" style="margin:0;font-size:.93rem">Open the Sound Lab. Each vowel has a card showing where the tongue sits on the quadrant, what the jaw and lips do, and how it is spelled.</p></div>
        <div class="card"><h3>2 · Drill</h3><p class="muted" style="margin:0;font-size:.93rem">Five activities of ten questions per unit. You need ${pc}% — ${Math.round(CONFIG.passMark*10)} out of 10 — to clear one. Questions reshuffle every attempt.</p></div>
        <div class="card"><h3>3 · Unlock</h3><p class="muted" style="margin:0;font-size:.93rem">${CONFIG.lockUnits?`Units open one at a time. Clear all five activities in a unit at ${pc}% and the next unit unlocks.`:'All ten units are open from the start.'}</p></div>
        <div class="card"><h3>4 · Record</h3><p class="muted" style="margin:0;font-size:.93rem">The Speaking Studio plays a model, then records you saying it so you can compare. Clips can be sent to your teacher.</p></div>
      </div>
    </section>

    <section class="sec">
      <div class="sec-head"><h2>The ten contrasts</h2><p class="muted" style="margin:0;font-size:.88rem">${cleared} of ${UNITS.length} cleared${Store.ok?'':' · progress is not being saved in this browser'}</p></div>
      <div class="grid g2">${cards}</div>
    </section>
  `);
}

function viewLab(sel){
  const key = sel || 'iy';
  const s = V[key];
  const chips = ORDER.map(k=>`<button class="mini ${k===key?'':'ghost'}" data-sound="${k}"
      style="${k===key?'border-color:var(--tense);color:var(--tense)':''};font-family:var(--display);font-style:italic;font-size:1rem">${V[k].ipa}</button>`).join('');

  setView(`
    <p class="kicker">Sound Lab</p>
    <h1>The <em>quadrant</em></h1>
    <p class="lede">Vowels are defined in relation to one another rather than against any outside standard. This is the book's Figure 4.1 — the vowel quadrant laid over a sagittal section of the mouth. The solid line is the tongue for the selected vowel; the dashed lines are all the others, so you can see the whole system at once.</p>

    <div class="row" style="gap:7px;margin-bottom:22px">${chips}</div>

    <div class="grid g2" style="align-items:start">
      <div>
        <div class="figwrap" id="fig">${FIG.render(key)}</div>
        <p class="figcap">Figure 4.1 — vowel quadrant and sagittal section · lips after Figure 4.3</p>
      </div>
      <div class="card">
        <div class="tags">
          <span class="tag ${s.tense?'tense':'lax'}">${s.tense?'tense':'lax'}</span>
          <span class="tag">${esc(s.name)}</span>
          <span class="tag">lips: ${esc(FIG.lipText(s.lip))}</span>
          ${s.diph?'<span class="tag">diphthong</span>':''}
        </div>
        <p class="ipa ${s.tense?'tense':'lax'}">/${s.ipa}/ <span class="muted" style="font-size:1rem;font-style:normal">IPA /${s.ipaAlt}/</span></p>
        <p style="color:var(--ink-2)">${esc(s.how)}</p>

        <h3 style="margin-top:22px">Hear it in words</h3>
        <div class="row" id="words">
          ${s.words.map(w=>`<button class="mini ghost" data-say="${esc(w)}">${esc(w)}</button>`).join('')}
        </div>

        <h3 style="margin-top:22px">Common spellings</h3>
        <table class="spell"><thead><tr><th>Spelling</th><th>Examples</th></tr></thead><tbody>
          ${s.spellings.map(x=>`<tr><td>${esc(x.p)}</td><td class="wordrow">${esc(x.e)}
            <button class="play" data-say="${esc(x.e.split(',')[0])}" aria-label="Play">${playIcon()}</button></td></tr>`).join('')}
        </tbody></table>
      </div>
    </div>

    <div class="row" style="margin-top:32px">
      <button class="btn sec" data-go="home">Back to the units</button>
    </div>
  `);
}

const ACTS = [
  {id:'mp',  name:'Minimal Pairs',   hint:'Listen, then choose the word you heard.'},
  {id:'sd',  name:'Same or Different',hint:'Two words. Decide whether the vowel is the same.'},
  {id:'odd', name:'Odd One Out',      hint:'Three words. One has a different vowel.'},
  {id:'ctx', name:'In Context',       hint:'Listen to the sentence and choose the missing word.'},
  {id:'sp',  name:'Spelling to Sound',hint:'No audio. Decide which vowel the spelling makes.'},
];

function viewUnit(id){
  const idx = unitIndex(id);
  const u = UNITS[idx]; if(!u) return viewHome();
  if(!unitUnlocked(idx)){ toast(`Unit ${idx+1} is locked — clear Unit ${idx} first.`); return viewHome(); }
  const A=V[u.a], B=V[u.b];
  const tiles = ACTS.map(a=>{
    const k=u.id+':'+a.id, sc=State.scores[k];
    return `<button class="card link ${State.done[k]?'done':''}" data-act="${u.id}|${a.id}">
      <div class="tags"><span class="tag">${esc(a.name)}</span>${State.done[k]?`<span class="tag ok">${sc}/10</span>`:''}</div>
      <p class="muted" style="margin:0;font-size:.92rem">${esc(a.hint)}</p>
    </button>`;
  }).join('');

  setView(`
    <p class="kicker">${esc(u.title)} · relative functional load ${esc(u.rfl)}</p>
    <h1><em>${A.ipa}</em> vs ${B.ipa}</h1>
    <p class="lede">${esc(u.blurb)}</p>

    <div class="grid g2" style="align-items:start;margin-bottom:8px">
      ${[u.a,u.b].map(k=>{const s=V[k];return `
        <div class="card">
          <div class="tags"><span class="tag ${s.tense?'tense':'lax'}">${s.tense?'tense':'lax'}</span><span class="tag">${esc(s.name)}</span></div>
          <p class="ipa ${s.tense?'tense':'lax'}">/${s.ipa}/</p>
          <div class="figwrap" style="margin:10px 0">${FIG.render(k)}</div>
          <p style="color:var(--ink-2);font-size:.94rem">${esc(s.how)}</p>
          <div class="row">${s.words.slice(0,5).map(w=>`<button class="mini ghost" data-say="${esc(w)}">${esc(w)}</button>`).join('')}</div>
        </div>`;}).join('')}
    </div>

    <section class="sec">
      <div class="sec-head"><h2>Practice</h2><p class="muted" style="margin:0;font-size:.88rem">${unitDoneCount(u)} of ${ACTS.length} cleared · ${Math.round(CONFIG.passMark*100)}% to pass each one</p></div>
      <div class="grid g2">${tiles}
        <button class="card link" data-studio="${u.id}">
          <div class="tags"><span class="tag" style="color:var(--amber);border-color:rgba(255,201,74,.45)">Speaking Studio</span></div>
          <p class="muted" style="margin:0;font-size:.92rem">Hear a model, record yourself, compare the two.</p>
        </button>
      </div>
    </section>

    ${CONFIG.lockUnits && UNITS[idx+1] ? `<p class="muted" style="margin-top:18px;font-size:.9rem">
      ${unitCleared(u) ? `Unit ${idx+2} is open.`
        : `Clear all ${ACTS.length} activities here at ${Math.round(CONFIG.passMark*100)}% to unlock Unit ${idx+2}.`}</p>` : ''}

    <div class="row" style="margin-top:22px"><button class="btn sec" data-go="home">All units</button></div>
  `);
}

/* ============================================================================
   8. QUESTION BUILDERS
   ========================================================================== */
function buildQuestions(u, actId, n){
  const A=V[u.a], B=V[u.b], Q=[];
  const pairs = shuffle(u.pairs);

  /* a pair may carry its own symbols: [wordA, wordB, ipaA, ipaB] */
  const sym = (p,i) => p[2+i] || (i===0?A.ipa:B.ipa);

  if(actId==='mp'){
    for(const p of pairs.slice(0,n)){
      const flip = Math.random()<.5;
      const [w1,w2] = flip ? [p[1],p[0]] : [p[0],p[1]];
      const [s1,s2] = flip ? [sym(p,1),sym(p,0)] : [sym(p,0),sym(p,1)];
      Q.push({ say:w1, prompt:'Which word did you hear?', opts:[w1,w2].sort(()=>Math.random()-.5),
               ans:w1, why:`${w1} has /${s1}/; ${w2} has /${s2}/.` });
    }
  }
  if(actId==='sd'){
    for(let i=0;i<n;i++){
      const p = pairs[i%pairs.length];
      const same = Math.random()<.5;
      const w1 = p[Math.random()<.5?0:1];
      const w2 = same ? w1 : (w1===p[0]?p[1]:p[0]);
      Q.push({ say:w1+', '+w2, prompt:'Is the vowel the same or different?', opts:['Same','Different'],
               ans: same?'Same':'Different',
               why: same ? `Both words were "${w1}".` : `"${p[0]}" has /${sym(p,0)}/ and "${p[1]}" has /${sym(p,1)}/.` });
    }
  }
  if(actId==='odd'){
    for(let i=0;i<n;i++){
      const src = pairs[i%pairs.length];
      const oddFirst = Math.random()<.5;
      const base = oddFirst?0:1, other=oddFirst?1:0;
      const sameOnes = pick(pairs.filter(p=>p!==src),2).map(p=>p[base]);
      const odd = src[other];
      const trio = shuffle([...sameOnes, odd]);
      Q.push({ say:trio.join(', '), prompt:'Which word has a different vowel?', opts:trio, ans:odd,
               why:`"${odd}" has /${sym(src,other)}/; the other two have /${sym(src,base)}/.` });
    }
  }
  if(actId==='ctx'){
    const bank = u.sents.length?u.sents:[];
    for(let i=0;i<n;i++){
      const p = pairs[i%pairs.length];
      const flip = Math.random()<.5;
      const [target,other] = flip?[p[1],p[0]]:[p[0],p[1]];
      const s = bank.length ? bank[i%bank.length][0] : null;
      const sentence = s && s.toLowerCase().includes(p[0].toLowerCase())
        ? s.replace(new RegExp(p[0],'i'), target)
        : `I said the word ${target}, not ${other}.`;
      Q.push({ say:sentence, prompt:'Which word was in the sentence?', opts:[target,other].sort(()=>Math.random()-.5),
               ans:target, why:`The sentence used "${target}" — /${flip?sym(p,1):sym(p,0)}/.` });
    }
  }
  if(actId==='sp'){
    const wordsA = A.words, wordsB = B.words;
    for(let i=0;i<n;i++){
      const useA = i%2===0;
      const w = (useA?wordsA:wordsB)[Math.floor(i/2)%(useA?wordsA:wordsB).length];
      Q.push({ say:w, prompt:`Which vowel does <em>${esc(w)}</em> have?`,
               opts:[`/${A.ipa}/`,`/${B.ipa}/`].sort(()=>Math.random()-.5),
               ans:`/${(useA?A:B).ipa}/`,
               why:`"${w}" is pronounced with /${(useA?A:B).ipa}/.` });
    }
  }
  return Q.slice(0,n);
}

function runQuiz({title, sub, questions, onDone, backTo}){
  let i=0, right=0;
  const total = questions.length;

  function draw(){
    const q = questions[i];
    setView(`
      <p class="kicker">${esc(sub)}</p>
      <h1 style="font-size:clamp(1.5rem,4vw,2.2rem)">${esc(title)}</h1>
      <div class="qhead">
        <div class="progress"><i style="width:${(i/total)*100}%"></i></div>
        <span class="qcount">${i+1} / ${total}</span>
      </div>
      <div class="card">
        <p class="qprompt">${q.prompt}</p>
        ${q.say?`<div class="row" style="margin:14px 0 4px">
          <button class="play big" id="rep" aria-label="Play again">${playIcon()}</button>
          <button class="mini ghost" id="slow">Slower</button>
          <span class="wave" id="wave"><i></i><i></i><i></i><i></i><i></i></span>
        </div><p class="qhint">Play as many times as you need.</p>`:'<p class="qhint">Read it, then decide.</p>'}
        <div class="opts" id="opts">
          ${q.opts.map(o=>`<button class="opt" data-o="${esc(o)}">${o}</button>`).join('')}
        </div>
        <div id="fb"></div>
      </div>
      <div class="row" style="margin-top:24px"><button class="btn sec" data-go="${backTo}">Leave</button></div>
    `);

    const wave = document.getElementById('wave');
    const speak = slow => {
      if(!q.say) return;
      if(wave) wave.classList.add('on');
      const u = Audio_.say(q.say, slow);
      if(u) u.onend = ()=> wave && wave.classList.remove('on');
    };
    if(q.say) autoPlayTimer = setTimeout(()=>speak(false), 260);
    const rep=document.getElementById('rep'), sl=document.getElementById('slow');
    if(rep) rep.onclick=()=>speak(false);
    if(sl) sl.onclick=()=>speak(true);

    document.getElementById('opts').addEventListener('click', e=>{
      const b = e.target.closest('.opt'); if(!b) return;
      const chosen = b.dataset.o, ok = chosen===q.ans;
      if(ok) right++;
      [...document.querySelectorAll('.opt')].forEach(x=>{
        x.disabled=true;
        if(x.dataset.o===q.ans) x.classList.add('right');
        else if(x===b) x.classList.add('wrong');
      });
      document.getElementById('fb').innerHTML =
        `<div class="fb ${ok?'ok':'no'}"><strong>${ok?'Correct.':'Not quite.'}</strong> ${esc(q.why)}
         <div class="row end" style="margin-top:12px">
           <button class="btn" id="next">${i+1<total?'Next':'See result'}</button></div></div>`;
      document.getElementById('next').onclick=()=>{ i++; i<total?draw():onDone(right,total); };
    }, {once:false});
  }
  draw();
}

function viewActivity(unitId, actId){
  const idx = unitIndex(unitId);
  if(!unitUnlocked(idx)){ toast(`Unit ${idx+1} is locked.`); return viewHome(); }
  const u = UNITS[idx], a = ACTS.find(x=>x.id===actId);
  const qs = buildQuestions(u, actId, 10);
  runQuiz({
    title:a.name, sub:`${u.title} · ${a.hint}`, questions:qs, backTo:'unit:'+unitId,
    onDone:(right,total)=>{
      const pct = right/total, pass = pct>=CONFIG.passMark;
      const key = unitId+':'+actId;
      const wasCleared = unitCleared(u);
      State.scores[key]=right;
      if(pass) State.done[key]=true;
      saveProgress();

      const idx = unitIndex(unitId);
      const nowCleared = unitCleared(u);
      const justCleared = nowCleared && !wasCleared;
      const nextU = UNITS[idx+1];
      const left = ACTS.length - unitDoneCount(u);
      const need = Math.round(CONFIG.passMark*10);

      let note;
      if(!pass){
        note = `You need ${Math.round(CONFIG.passMark*100)}% — ${need} out of ${total} — to clear an activity. Go back to the Sound Lab, look at where the two vowels sit on the quadrant, then try again. The questions reshuffle every time.`;
      } else if(justCleared && nextU && CONFIG.lockUnits){
        note = `That clears Unit ${idx+1}. <strong>Unit ${idx+2} — ${esc(nextU.title)} — is now unlocked.</strong>`;
      } else if(justCleared && !nextU){
        note = 'That clears the last unit. The final exam is open.';
      } else if(left){
        note = `You are hearing this contrast reliably. ${left} more activit${left===1?'y':'ies'} to clear this unit.`;
      } else {
        note = 'You are hearing this contrast reliably.';
      }

      setView(`
        <p class="kicker">${esc(u.title)} · ${esc(a.name)}</p>
        <p class="score ${pass?'pass':'fail'}">${right}<span class="muted" style="font-size:2rem">/${total}</span></p>
        <h1 style="font-size:clamp(1.4rem,4vw,2rem)">${pass?(justCleared?'Unit cleared.':'Cleared.'):'Not yet — try it again.'}</h1>
        <p class="lede">${note}</p>
        <div class="row">
          ${pass?'':`<button class="btn" data-act="${unitId}|${actId}">Try again</button>`}
          ${justCleared && nextU ? `<button class="btn" data-go="unit:${nextU.id}">Start Unit ${idx+2}</button>`
            : (pass?`<button class="btn" data-go="unit:${unitId}">Back to the unit</button>`
                   :`<button class="btn sec" data-go="unit:${unitId}">Back to the unit</button>`)}
          ${justCleared && !nextU ? '<button class="btn" data-go="exam">Take the final exam</button>' : ''}
          ${CONFIG.endpoint?`<button class="btn sec" id="send">Send this score to my teacher</button>`:''}
        </div>
      `);
      const s=document.getElementById('send');
      if(s) s.onclick=()=>sendScore({unit:u.title, activity:a.name, score:right, total});
    }
  });
}

/* ============================================================================
   9. SPEAKING STUDIO
   ========================================================================== */
function viewStudio(unitId){
  const idx = unitIndex(unitId);
  if(!unitUnlocked(idx)){ toast(`Unit ${idx+1} is locked.`); return viewHome(); }
  const u = UNITS[idx];
  const tasks = [...u.pairs.slice(0,5).map(p=>({t:`${p[0]} — ${p[1]}`, kind:'pair'})),
                 ...u.sents.slice(0,2).map(s=>({t:s[0], kind:'sentence'}))];

  setView(`
    <p class="kicker">${esc(u.title)} · Speaking Studio</p>
    <h1>Say it, <em>then hear yourself</em>.</h1>
    <p class="lede">Play the model, record your own version, then play them one after the other. Recordings live in this page only — if you reload, they are gone.</p>
    <div id="tasks">
      ${tasks.map((t,i)=>`
        <div class="studio-task" data-i="${i}">
          <div class="row" style="justify-content:space-between">
            <div>
              <p class="muted" style="margin:0;font-size:.76rem;letter-spacing:.12em;text-transform:uppercase">${t.kind}</p>
              <p style="margin:2px 0 0;font-family:var(--display);font-size:1.15rem">${esc(t.t)}</p>
            </div>
            <div class="row">
              <button class="play" data-say="${esc(t.t)}" aria-label="Play model">${playIcon()}</button>
              <button class="mini ghost" data-slow="${esc(t.t)}">Slow</button>
              <button class="mini" data-rec="${i}">Record</button>
            </div>
          </div>
          <div class="meter"><i data-meter="${i}"></i></div>
          <div data-clip="${i}"></div>
        </div>`).join('')}
    </div>
    <div class="row" style="margin-top:26px">
      <button class="btn sec" data-go="unit:${unitId}">Back to the unit</button>
      ${CONFIG.endpoint?`<button class="btn sec" id="sendclips">Send my recordings</button>`:''}
    </div>
  `);

  studioUnit = unitId;
  const sc = document.getElementById('sendclips');
  if(sc) sc.onclick = ()=>sendClips(u.title);
}

/* ============================================================================
   10. EXAM
   ========================================================================== */
function viewExam(){
  if(!examUnlocked()){
    toast(`Clear ${CONFIG.examAfter - clearedCount()} more unit(s) before the exam.`);
    return viewHome();
  }
  const qs = shuffle(UNITS.flatMap(u=>{
    const act = pick(['mp','sd','odd','ctx','sp'],2);
    return act.flatMap(a=>buildQuestions(u,a,2));
  })).slice(0,40);

  runQuiz({
    title:'Final Exam', sub:'40 questions across all ten contrasts', questions:qs, backTo:'home',
    onDone:(right,total)=>{
      const pct = Math.round(right/total*100), pass = right/total>=CONFIG.passMark;
      setView(`
        <p class="kicker">Final Exam</p>
        <p class="score ${pass?'pass':'fail'}">${pct}<span class="muted" style="font-size:2rem">%</span></p>
        <h1 style="font-size:clamp(1.4rem,4vw,2rem)">${right} of ${total} correct</h1>
        <p class="lede">${pass?'You have control of the NAE vowel system across all ten contrasts.'
          :'Go back to the units where you scored lowest and run the activities again before retaking this.'}</p>
        <div class="row">
          <button class="btn sec" data-go="home">Back to the units</button>
          ${CONFIG.endpoint?`<button class="btn" id="send">Send my exam result</button>`:''}
        </div>
      `);
      const s=document.getElementById('send');
      if(s) s.onclick=()=>sendScore({unit:'FINAL EXAM', activity:'Exam', score:right, total});
    }
  });
}

/* ============================================================================
   11. SENDING TO THE SPREADSHEET
   ========================================================================== */
function who(){
  return { name:(document.getElementById('student')||{}).value||'',
           section:(document.getElementById('section')||{}).value||'' };
}
async function sendScore(d){
  const w = who();
  if(!w.name){ toast('Put your name in Settings first.'); return; }
  try{
    await fetch(CONFIG.endpoint,{ method:'POST', mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify({ kind:'score', name:w.name, section:w.section,
        unit:d.unit, activity:d.activity, score:d.score, total:d.total,
        percent: Math.round(d.score/d.total*100), at:new Date().toISOString() }) });
    toast('Sent to your teacher.');
  }catch(e){ toast('Could not send — check your connection.'); }
}
async function sendClips(unitTitle){
  const w = who();
  if(!w.name){ toast('Put your name in Settings first.'); return; }
  const keys = Object.keys(State.clips);
  if(!keys.length){ toast('Record something first.'); return; }
  toast('Uploading…');
  for(const k of keys){
    const blob = State.clips[k];
    const b64 = await new Promise(r=>{ const fr=new FileReader(); fr.onload=()=>r(fr.result.split(',')[1]); fr.readAsDataURL(blob); });
    try{
      await fetch(CONFIG.endpoint,{ method:'POST', mode:'no-cors',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({ kind:'recording', name:w.name, section:w.section,
          unit:unitTitle, task:k, mime:blob.type, data:b64, at:new Date().toISOString() }) });
    }catch(e){}
  }
  toast('Recordings sent.');
}

/* ============================================================================
   12. ROUTER
   ========================================================================== */
function go(route){
  if(route==='home') return viewHome();
  if(route==='lab')  return viewLab();
  if(route==='exam') return viewExam();
  if(route.startsWith('unit:')) return viewUnit(route.slice(5));
  if(route.startsWith('lab:'))  return viewLab(route.slice(4));
  viewHome();
}

document.addEventListener('click', e=>{
  const g = e.target.closest('[data-go]');
  if(g){ go(g.dataset.go); return; }
  const u = e.target.closest('[data-unit]');
  if(u){ viewUnit(u.dataset.unit); return; }
  const a = e.target.closest('[data-act]');
  if(a){ const [ui,ai]=a.dataset.act.split('|'); viewActivity(ui,ai); return; }
  const st = e.target.closest('[data-studio]');
  if(st){ viewStudio(st.dataset.studio); return; }
  const so = e.target.closest('[data-sound]');
  if(so){ viewLab(so.dataset.sound); return; }
  const sy = e.target.closest('[data-say]');
  if(sy){ Audio_.say(sy.dataset.say,false); return; }
  const sl = e.target.closest('[data-slow]');
  if(sl){ Audio_.say(sl.dataset.slow,true); return; }
});

/* one permanent handler for the Speaking Studio record buttons */
document.addEventListener('click', async e=>{
  const rb = e.target.closest('[data-rec]'); if(!rb) return;
  const i = rb.dataset.rec;
  const meter = document.querySelector(`[data-meter="${i}"]`);
  const slot  = document.querySelector(`[data-clip="${i}"]`);
  if(rb.dataset.on){ Rec.stop(); rb.dataset.on=''; rb.textContent='Record'; return; }
  const ok = await Rec.start(
    lvl => { if(meter) meter.style.width = lvl+'%'; },
    blob => {
      const url = URL.createObjectURL(blob);
      State.clips[(studioUnit||'u')+':'+i] = blob;
      if(slot) slot.innerHTML = `<audio controls src="${url}"></audio>`;
      if(meter) meter.style.width='0%';
      rb.dataset.on=''; rb.textContent='Re-record';
    });
  if(ok){ rb.dataset.on='1'; rb.innerHTML='<span class="rec-dot"></span> Stop'; }
});

document.addEventListener('DOMContentLoaded', ()=>{
  Audio_.init();
  const rs=document.getElementById('reset');
  if(rs){
    const note=document.getElementById('store-note');
    if(note) note.textContent = Store.ok
      ? 'Your progress is saved in this browser.'
      : 'This browser is blocking storage, so progress is lost on reload.';
    rs.onclick=()=>{
      if(!confirm('Clear all progress and lock every unit except the first?')) return;
      State.done={}; State.scores={}; Store.wipe();
      toast('Progress cleared.'); viewHome();
    };
  }
  const st=document.getElementById('settings-toggle'), sp=document.getElementById('settings');
  st.onclick=()=>{ const open=sp.hidden; sp.hidden=!open; st.setAttribute('aria-expanded',String(open)); };
  viewHome();
});
