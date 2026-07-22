// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
  /* ============================
   Core Runtime
============================ */

let listenersInitialized = false;

let beforeUnloadRegistered = false;

let animationRunning = false;

let petDestroyed = false;

/* ============================
   Timers
============================ */

let speechInterval = null;

let speechTimer = null;

let petTimer = null;

let eatTimer = null;

let yarnTimeout = null;
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");
  let persistPosition = true;

  let nekoPosX = 32;
  let nekoPosY = 32;
  
  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;
  let manualSleep = false;
  let sleepZ = null;
  // ---------- Pet System ----------
  let petMode = false;
  // ---------- Fish System ----------
  let fishMode = false;
  let fishEl = null;

  // ---------- Yarn ----------
  let yarnEl = null;

  let yarnX = 0;
  
  let yarnY = 0;

  let yarnMode = false;

  let yarnHitCount = 0;

  // ---------- Yarn Physics ----------
  let yarnVelocityX = 0;

  let yarnVelocityY = 0;

  let yarnPlayStart = 0;

  let yarnDuration = 13000;

  let yarnPushDistance = 40;

  let yarnRolling = false;

  let placingFish = false;

let placingYarn = false;

let petControls = null;

  // ---------- Speech Bubble ----------
  let speechEl = null;

    const randomMessages=[

     "Meow! 🐱",

     "I'm Harshit's virtual pet.",
  
     "I love fish 🐟",

     "I'm sleepy... 😴",

     "Pet me ❤️",

     "Let's build something amazing!",

     "Check out Harshit's projects 🚀",

     "Need a developer? 😺",

     "Hire Harshit 💼",

     "I like yarn 🧶",

     "I love chasing lasers 🔴"

];

  let fishX = 0;
  let fishY = 0;

  let eatingFish = false;

  // ---------- State Engine ----------
  const CAT_STATE = {
    FOLLOW: "follow",
    SLEEP: "sleep",
    PET: "pet",
    CHASE_FISH: "chase_fish",
    EAT_FISH: "eat_fish",
    PLAY_YARN: "play_yarn",
    CHASE_LASER: "chase_laser"
};

let currentState = CAT_STATE.FOLLOW;

// ---------- Target System ----------
let targetX = 0;
let targetY = 0;

// ---------- Portfolio Guide ----------
let currentSection = "";

let guideEnabled = true;

function updateCurrentSection(){

    if(!guideEnabled) return;

    const sections=document.querySelectorAll("section");

    if(!sections.length) return;

    let found="";

    sections.forEach(section=>{

        const rect=section.getBoundingClientRect();

        if(rect.top<=150 && rect.bottom>=150){

            found=section.id || section.dataset.section || "";

        }

    });

    if(found!==currentSection){

        currentSection=found;

        onSectionChanged(found);

    }

}

function setTarget(x, y){

    targetX = x;

    targetY = y;

}

  const nekoSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

function onMouseMove(event){

    if(manualSleep) return;

    if(event.touches){

        mousePosX = event.touches[0].clientX;
        mousePosY = event.touches[0].clientY;

    }else{

        mousePosX = event.clientX;
        mousePosY = event.clientY;

    }

}

function onKeyDown(e){

    const key = e.key.toLowerCase();

    // ---------------- FISH ----------------

    if(key==="f"){

        if(manualSleep) return;

        if(fishEl){

            fishEl.remove();

            fishEl=null;

            fishMode=false;

            currentState=CAT_STATE.FOLLOW;

            return;

        }

        fishMode=true;

        currentState=CAT_STATE.CHASE_FISH;

        fishX=mousePosX;
        fishY=mousePosY;

        fishEl=document.createElement("div");

        fishEl.innerHTML="🐟";

        fishEl.style.position="fixed";

        fishEl.style.left=(fishX-13)+"px";

        fishEl.style.top=(fishY-13)+"px";

        fishEl.style.fontSize="26px";

        fishEl.style.pointerEvents="none";

        fishEl.style.zIndex="999999";

        document.body.appendChild(fishEl);

        return;

    }

    // ---------------- YARN ----------------

    if(key==="y"){

        if(manualSleep) return;

        if(yarnEl){

            yarnEl.remove();

            yarnEl=null;

            yarnMode=false;

            currentState=CAT_STATE.FOLLOW;

            return;

        }

        yarnMode=true;

        yarnRolling=false;

        yarnPlayStart=Date.now();

        yarnVelocityX=0;

        yarnVelocityY=0;

        currentState=CAT_STATE.PLAY_YARN;

        yarnHitCount=0;

        yarnX=mousePosX;

        yarnY=mousePosY;

        yarnEl=document.createElement("div");

        yarnEl.innerHTML="🧶";

        yarnEl.style.position="fixed";

        yarnEl.style.left=(yarnX-15)+"px";

        yarnEl.style.top=(yarnY-15)+"px";

        yarnEl.style.fontSize="34px";

        yarnEl.style.transition="transform .15s linear";

        yarnEl.style.pointerEvents="none";

        yarnEl.style.zIndex="999999";

        document.body.appendChild(yarnEl);

        showSpeech("Yarn!! 🧶",2000);

        yarnTimeout=setTimeout(()=>{

            if(yarnMode){

                yarnMode=false;

                if(yarnEl){

                    yarnEl.remove();

                    yarnEl=null;

                }

                currentState=CAT_STATE.SLEEP;

                manualSleep=true;

                idleAnimation="sleeping";

                idleAnimationFrame=0;

                idleTime=0;

                showSpeech("Harshit's Cat is tired... 😴",4000);

            }

        },yarnDuration);

    }

}

  function init() {
    petDestroyed = false;
 
    if (!listenersInitialized) {

    listenersInitialized = true;

    document.addEventListener("mousemove", onMouseMove);


    document.addEventListener("touchstart", onMouseMove,{passive:true});
document.addEventListener("touchmove", onMouseMove,{passive:true});

    document.addEventListener("keydown", onKeyDown);

    document.addEventListener("pointerdown", placePetItem);

}

    let nekoFile = "./cat-animation.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    if (curScript && curScript.dataset.persistPosition) {
      if (curScript.dataset.persistPosition === "") {
        persistPosition = true;
      } else {
        persistPosition = JSON.parse(curScript.dataset.persistPosition.toLowerCase());
      }
    }
  
    if (persistPosition) {
      let storedNeko = JSON.parse(window.localStorage.getItem("oneko"));
      if (storedNeko !== null) {
        nekoPosX = storedNeko.nekoPosX;
        nekoPosY = storedNeko.nekoPosY;
        mousePosX = storedNeko.mousePosX;
        mousePosY = storedNeko.mousePosY;
        frameCount = storedNeko.frameCount;
        idleTime = storedNeko.idleTime;
        idleAnimation = storedNeko.idleAnimation;
        idleAnimationFrame = storedNeko.idleAnimationFrame;
        nekoEl.style.backgroundPosition = storedNeko.bgPos;
      }
    }
  
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;

    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    
    document.body.appendChild(nekoEl);

    const fishBtn = document.getElementById("fishBtn");

const yarnBtn = document.getElementById("yarnBtn");

fishBtn.style.display = "none";

yarnBtn.style.display = "none";

    petControls=document.createElement("div");

petControls.id="petControls";

petControls.style.position="fixed";
petControls.style.top="18px";
petControls.style.right="20px";
petControls.style.display="flex";
petControls.style.gap="8px";
petControls.style.zIndex="999999";

fishBtn.onclick=function(){

    placingFish=true;

    placingYarn=false;

    fishBtn.classList.add("active");

    yarnBtn.classList.remove("active");

    showSpeech("Tap anywhere to place Fish 🐟",2500);

}

yarnBtn.onclick=function(){

    placingYarn=true;

    placingFish=false;

    yarnBtn.classList.add("active");

    fishBtn.classList.remove("active");

    showSpeech("Tap anywhere to place Yarn 🧶",2500);

}

    // Click to Sleep
nekoEl.style.pointerEvents = "auto";

nekoEl.addEventListener("click", function () {

    manualSleep = !manualSleep;

    currentState = manualSleep
    ? CAT_STATE.SLEEP
    : CAT_STATE.FOLLOW;

    if(manualSleep){

        idleAnimation = "sleeping";
        idleAnimationFrame = 0;

        if(!sleepZ){

            sleepZ=document.createElement("div");

            sleepZ.id="sleepZ";

            sleepZ.innerHTML="💤";

            sleepZ.style.position="fixed";

            sleepZ.style.fontSize="24px";

            sleepZ.style.pointerEvents="none";

            sleepZ.style.zIndex="999999";

            document.body.appendChild(sleepZ);

        }

    }else{

        idleAnimation=null;

        idleAnimationFrame=0;

        idleTime=0;

        eatingFish = false;

        if(sleepZ){

            sleepZ.remove();

            sleepZ=null;

        }

    }

});

// Double Click = Pet
nekoEl.addEventListener("dblclick", function () {

    // Agar cat so rahi hai to pet mode mat chalao
    if (manualSleep) return;

    petMode = true;

    currentState = CAT_STATE.PET;

    clearTimeout(petTimer);

    createHeart();

    showSpeech("Purrrrr ❤️",2000);

    petTimer = setTimeout(function () {

        petMode = false;

        currentState = CAT_STATE.FOLLOW;

    }, 2000);

});
    
if (persistPosition && !beforeUnloadRegistered) {

    beforeUnloadRegistered = true;

    window.addEventListener("beforeunload", function () {

        window.localStorage.setItem("oneko", JSON.stringify({

            nekoPosX,
            nekoPosY,
            mousePosX,
            mousePosY,
            frameCount,
            idleTime,
            idleAnimation,
            idleAnimationFrame,
            bgPos: nekoEl.style.backgroundPosition

        }));

    });

}

    showSpeech("👋 Hi! I'm Harshit's virtual pet.",5000);

speechInterval = setInterval(()=>{

    if(currentState===CAT_STATE.FOLLOW){

        showSpeech(

            randomMessages[

                Math.floor(Math.random()*randomMessages.length)

            ]

        );

    }

},20000);

    if(!animationRunning){

    animationRunning = true;

    window.requestAnimationFrame(onAnimationFrame);

}
  }

  let lastFrameTimestamp;

  /* ============================================
   Virtual Pet Engine
============================================ */

function destroyVirtualPet() {

    petDestroyed = true;

    // Remove Cat
    if (nekoEl && nekoEl.isConnected) {
        nekoEl.remove();
    }

    // Remove Sleep Bubble
    if (sleepZ) {
        sleepZ.remove();
        sleepZ = null;
    }

    // Remove Speech Bubble
    if (speechEl) {
        speechEl.remove();
        speechEl = null;
    }

    // Remove Fish
    if (fishEl) {
        fishEl.remove();
        fishEl = null;
    }

    // Remove Yarn
    if (yarnEl) {
        yarnEl.remove();
        yarnEl = null;
    }

    // Remove Controls

if(petControls){

    petControls.remove();

    petControls = null;

}

    // Clear Timers
    clearAllTimers();

    // Reset States
    fishMode = false;
    yarnMode = false;
    petMode = false;
    manualSleep = false;

    if(sleepZ){

    sleepZ.remove();

    sleepZ=null;

}

    eatingFish = false;

    currentState = CAT_STATE.FOLLOW;

    animationRunning = false;

    const fishBtn = document.getElementById("fishBtn");

const yarnBtn = document.getElementById("yarnBtn");

fishBtn.style.display = "none";

yarnBtn.style.display = "none";

fishBtn.classList.remove("active");

yarnBtn.classList.remove("active");

placingFish = false;

placingYarn = false;

}

function clearAllTimers(){

    clearTimeout(petTimer);

    clearTimeout(eatTimer);

    clearTimeout(speechTimer);

    clearTimeout(yarnTimeout);

    if(speechInterval){

        clearInterval(speechInterval);

        speechInterval=null;

    }

}

window.destroyVirtualPet = destroyVirtualPet;

  function onAnimationFrame(timestamp) {
    if (petDestroyed) {
    return;
}
    // Stops execution if the neko element is removed from DOM
    if (!nekoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function placePetItem(e){

    if(!placingFish && !placingYarn){

    return;

}

    if(placingFish){

        placingFish=false;
        
        fishBtn.classList.remove("active");

        if(manualSleep) return;

        fishMode=true;

        currentState=CAT_STATE.CHASE_FISH;

        fishX=e.clientX;
        fishY=e.clientY;

        if(fishEl) fishEl.remove();

        fishEl=document.createElement("div");

        fishEl.innerHTML="🐟";

        fishEl.style.position="fixed";

        fishEl.style.left=(fishX-13)+"px";

        fishEl.style.top=(fishY-13)+"px";

        fishEl.style.fontSize="26px";

        fishEl.style.pointerEvents="none";

        fishEl.style.zIndex="999999";

        document.body.appendChild(fishEl);

        return;

    }

    if(placingYarn){

        placingYarn=false;

        yarnBtn.classList.remove("active");

        if(manualSleep) return;

        yarnMode=true;

        yarnRolling=false;

yarnVelocityX=0;

yarnVelocityY=0;

yarnPlayStart=Date.now();

yarnHitCount=0;

        currentState=CAT_STATE.PLAY_YARN;

        yarnX=e.clientX;

        yarnY=e.clientY;

        if(yarnEl) yarnEl.remove();

        yarnEl=document.createElement("div");

        yarnEl.innerHTML="🧶";

        yarnEl.style.position="fixed";

        yarnEl.style.left=(yarnX-15)+"px";

        yarnEl.style.top=(yarnY-15)+"px";

        yarnEl.style.fontSize="34px";

        yarnEl.style.pointerEvents="none";

        yarnEl.style.zIndex="999999";

        document.body.appendChild(yarnEl);

        showSpeech("Yarn!! 🧶",2000);

clearTimeout(yarnTimeout);

yarnTimeout=setTimeout(()=>{

    if(yarnMode){

        yarnMode=false;

        if(yarnEl){

            yarnEl.remove();

            yarnEl=null;

        }

        currentState=CAT_STATE.SLEEP;

        manualSleep=true;

        idleAnimation="sleeping";

        idleAnimationFrame=0;

        idleTime=0;

    }

},yarnDuration);

    }

}

  function updateTarget(){

    if(manualSleep){

    return;

}

    switch(currentState){

        case CAT_STATE.FOLLOW:

            setTarget(mousePosX,mousePosY);

        break;

        case CAT_STATE.CHASE_FISH:

            setTarget(fishX,fishY);

        break;

        case CAT_STATE.EAT_FISH:

            setTarget(fishX,fishY);

        break;

        case CAT_STATE.PLAY_YARN:

            setTarget(yarnX,yarnY);

        break;

        case CAT_STATE.CHASE_LASER:

        break;

    }

}

  function frame() {

   if(updateAnimation()){

    return;

}

    frameCount += 1;

    updateCurrentSection();

    updateTarget();

    updateYarnPhysics();

    const diffX = nekoPosX - targetX;
    const diffY = nekoPosY - targetY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    // Fish ke liye thoda bada hitbox
const fishDistance = Math.sqrt(
    (nekoPosX - fishX) ** 2 +
    (nekoPosY - fishY) ** 2
);


if (fishMode) {

  console.log("Fish Distance:", fishDistance);

    if (fishDistance <= 50) {

      // Cat ko fish ke exact center par lock karo
       nekoPosX = targetX;
       nekoPosY = targetY;

       nekoEl.style.left = `${nekoPosX - 16}px`;
       nekoEl.style.top = `${nekoPosY - 16}px`;

        if(!eatingFish){

            eatingFish=true;

            console.log("Fish Eat Triggered");

            currentState = CAT_STATE.EAT_FISH;

            setSprite("scratchSelf",frameCount);

            createEatParticles();

            showSpeech("Yummy!! 🐟",2500);

            eatTimer=setTimeout(()=>{

                if(fishEl){

                    fishEl.remove();

                    fishEl=null;

                }

                fishMode=false;

                eatingFish=false;

                manualSleep=true;

                currentState=CAT_STATE.SLEEP;

                idleAnimation="sleeping";

                idleAnimationFrame=0;

                idleTime=0;

                showSpeech("Zzz... 😴",3000);

            },1000);

        }

        return;


      }

    }

    if(yarnMode){

    if(distance<=nekoSpeed){

        yarnHitCount++;

        createDust();

        const angle=Math.atan2(

        yarnY-nekoPosY,

        yarnX-nekoPosX

);

        yarnVelocityX=Math.cos(angle)*8;

        yarnVelocityY=Math.sin(angle)*8;

        yarnX=Math.max(30,Math.min(window.innerWidth-30,yarnX));

        yarnY=Math.max(30,Math.min(window.innerHeight-30,yarnY));

        yarnEl.style.left=(yarnX-15)+"px";

        yarnEl.style.top=(yarnY-15)+"px";

        showSpeech("Catch it!! 🧶",700);

        if(Date.now()-yarnPlayStart>yarnDuration){

            yarnMode=false;

            currentState=CAT_STATE.FOLLOW;

            yarnEl.remove();

            yarnEl=null;

            showSpeech("That was fun ❤️",2500);

        }

        return;

    }

}

    else{

    if (
    !fishMode &&
    (distance < nekoSpeed || distance < 48)
) {
        idle();
        return;
    }

}

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

   updateMovement(distance,diffX,diffY);

   if(speechEl){

    speechEl.style.left=(nekoPosX+25)+"px";

    speechEl.style.top=(nekoPosY-55)+"px";

}
  }   

function updateYarnPhysics(){

    if(!yarnMode || !yarnEl) return;

    yarnX += yarnVelocityX;

    yarnY += yarnVelocityY;

    yarnVelocityX *= 0.94;

    yarnVelocityY *= 0.94;

    if(Math.abs(yarnVelocityX)<0.05) yarnVelocityX=0;

    if(Math.abs(yarnVelocityY)<0.05) yarnVelocityY=0;

    yarnX=Math.max(20,Math.min(window.innerWidth-20,yarnX));

    yarnY=Math.max(20,Math.min(window.innerHeight-20,yarnY));

    yarnEl.style.left=(yarnX-15)+"px";

    yarnEl.style.top=(yarnY-15)+"px";

    const speed=Math.abs(yarnVelocityX)+Math.abs(yarnVelocityY);

    yarnEl.style.transform=`rotate(${frameCount*20}deg) scale(${1+speed/12})`;

}

function onSectionChanged(section){

    switch(section){

        case "home":

            showSpeech("👋 Welcome to Harshit's Portfolio!",3500);

        break;

        case "about":

            showSpeech("👨 This is Harshit. A passionate Full Stack Developer.",4000);

        break;

        case "skills":

            showSpeech("💻 These are Harshit's technical skills.",3500);

        break;

        case "projects":

            showSpeech("🚀 Explore some amazing projects here!",3500);

        break;

        case "experience":

            showSpeech("💼 Here's Harshit's experience.",3500);

        break;

        case "education":

    showSpeech(
        "🎓 Here you'll find Harshit's education and certifications.",
        4500
    );

break;

            showSpeech("🎓 These are Harshit's certifications.",3500);

        break;

        case "contact":

            showSpeech("📧 Let's connect together!",3500);

        break;

    }

}

  function updateMovement(distance,diffX,diffY){

    let direction="";

    direction += diffY/distance>0.5 ? "N":"";
    direction += diffY/distance<-0.5 ? "S":"";
    direction += diffX/distance>0.5 ? "W":"";
    direction += diffX/distance<-0.5 ? "E":"";

    setSprite(direction,frameCount);

    nekoPosX -= (diffX/distance)*nekoSpeed;

    nekoPosY -= (diffY/distance)*nekoSpeed;

    nekoPosX=Math.min(Math.max(16,nekoPosX),window.innerWidth-16);

    nekoPosY=Math.min(Math.max(16,nekoPosY),window.innerHeight-16);

    nekoEl.style.left=`${nekoPosX-16}px`;

    nekoEl.style.top=`${nekoPosY-16}px`;

}

function updateAnimation(){

    switch(currentState){

        case CAT_STATE.SLEEP:

            setSprite("sleeping",Math.floor(idleAnimationFrame/4));

            idleAnimationFrame++;

            if(sleepZ){

                sleepZ.style.left=(nekoPosX+10)+"px";

                sleepZ.style.top=(nekoPosY-30)+"px";

            }

            if(speechEl){

    speechEl.style.left=(nekoPosX+25)+"px";

    speechEl.style.top=(nekoPosY-55)+"px";

}

            return true;

        case CAT_STATE.EAT_FISH:

            setSprite("scratchSelf",frameCount);

            return true;

            case CAT_STATE.PLAY_YARN:

    setSprite("scratchSelf",frameCount);

    return false;

        case CAT_STATE.PET:

            setSprite("alert",frameCount);

            return false;

        default:

            return false;

    }

}

  function createEatParticles(){

    for(let i=0;i<6;i++){

        const p=document.createElement("div");

        p.innerHTML=Math.random()>0.5?"✨":"•";

        p.style.position="fixed";

        p.style.left=(nekoPosX+10+(Math.random()*16-8))+"px";

        p.style.top=(nekoPosY-5+(Math.random()*10-5))+"px";

        p.style.pointerEvents="none";

        p.style.fontSize="14px";

        p.style.zIndex="999999";

        document.body.appendChild(p);

        let x=(Math.random()*20)-10;
        let y=(Math.random()*20)-10;

        let opacity=1;

        const anim=setInterval(()=>{

            opacity-=0.08;

            p.style.opacity=opacity;

            p.style.transform=`translate(${x}px,${y}px)`;

            y-=1;

            if(opacity<=0){

                clearInterval(anim);

                p.remove();

            }

        },16);

    }

}

function createDust(){

    for(let i=0;i<5;i++){

        const dust=document.createElement("div");

        dust.innerHTML="💨";

        dust.style.position="fixed";

        dust.style.left=(yarnX-5+Math.random()*10)+"px";

        dust.style.top=(yarnY-5+Math.random()*10)+"px";

        dust.style.pointerEvents="none";

        dust.style.fontSize="12px";

        dust.style.opacity="1";

        dust.style.zIndex="999999";

        document.body.appendChild(dust);

        let y=0;

        const anim=setInterval(()=>{

            y++;

            dust.style.transform=`translateY(${-y}px)`;

            dust.style.opacity=1-y/25;

            if(y>25){

                clearInterval(anim);

                dust.remove();

            }

        },16);

    }

}

  function createHeart(){

    const heart=document.createElement("div");

    heart.innerHTML="❤️";

    heart.style.position="fixed";

    heart.style.left=(nekoPosX+5)+"px";

    heart.style.top=(nekoPosY-20)+"px";

    heart.style.fontSize="22px";

    heart.style.pointerEvents="none";

    heart.style.zIndex="999999";

    document.body.appendChild(heart);

    let y=0;

    const anim=setInterval(()=>{

        y++;

        heart.style.transform=`translateY(${-y}px) scale(${1+y/50})`;

        heart.style.opacity=1-y/50;

        if(y>50){

            clearInterval(anim);

            heart.remove();

        }

    },16);

}

function showSpeech(message,duration=3000){

    if(!speechEl){

        speechEl=document.createElement("div");

        speechEl.style.position="fixed";

        speechEl.style.maxWidth="180px";

        speechEl.style.padding="8px 12px";

        speechEl.style.background="rgba(20,20,20,.25)";

        speechEl.style.color="white";

        speechEl.style.borderRadius="14px";

        speechEl.style.fontSize="13px";

        speechEl.style.fontWeight="600";

        speechEl.style.boxShadow="0 8px 30px rgba(0,0,0,.25)";

        speechEl.style.backdropFilter="blur(12px)";

        speechEl.style.border="1px solid rgba(255,255,255,.15)";

        speechEl.style.pointerEvents="none";

        speechEl.style.transition=".3s";

        speechEl.style.textShadow="0 1px 3px rgba(0,0,0,.6)";

        speechEl.style.userSelect="none";

        speechEl.style.whiteSpace="pre-line";

        speechEl.style.opacity="0";

        speechEl.style.zIndex="999999";

        document.body.appendChild(speechEl);

    }

    speechEl.innerHTML=message;

    speechEl.style.left=(nekoPosX+25)+"px";

    speechEl.style.top=(nekoPosY-55)+"px";

    speechEl.style.opacity="1";

    clearTimeout(speechTimer);

    speechTimer=setTimeout(()=>{

        speechEl.style.opacity="0";

    },duration);

}

window.spawnVirtualPet = function () {

    if (window.__petStarted) return;

    window.__petStarted = true;

    init();

};

})();
