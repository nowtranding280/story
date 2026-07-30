/*=========================================================
    EVXY STORY WRITER
    JAVASCRIPT PART 1
    Theme + Live Preview + Statistics
=========================================================*/

// ===============================
// Elements
// ===============================

const themeSelect = document.getElementById("themeSelect");

const storyTitle = document.getElementById("storyTitle");
const chapterTitle = document.getElementById("chapterTitle");
const chapterNumber = document.getElementById("chapterNumber");
const storyContent = document.getElementById("storyContent");

const previewTitle = document.getElementById("previewTitle");
const previewChapter = document.getElementById("previewChapter");
const previewContent = document.getElementById("previewContent");

const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const readingTime = document.getElementById("readingTime");

const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");

const storyList = document.getElementById("storyList");
const searchStory = document.getElementById("searchStory");

// ===============================
// Current Story
// ===============================

let currentStoryId = null;

// ===============================
// Theme System
// ===============================

function loadTheme(){

    const savedTheme =
    localStorage.getItem("evxy_theme") || "midnight";

    document.body.className = savedTheme;

    themeSelect.value = savedTheme;

}

loadTheme();

themeSelect.addEventListener("change",function(){

    document.body.className = this.value;

    localStorage.setItem(
        "evxy_theme",
        this.value
    );

});

// ===============================
// Live Preview
// ===============================

function updatePreview(){

    previewTitle.textContent =
    storyTitle.value.trim() || "Story Title";

    if(chapterTitle.value.trim()==""){

        previewChapter.textContent =
        "Chapter";

    }

    else{

        previewChapter.textContent =
        "Chapter " +
        (chapterNumber.value || "1") +
        " : " +
        chapterTitle.value;

    }

    previewContent.textContent =
    storyContent.value ||
    "Your story preview will appear here...";

}

storyTitle.addEventListener("input",updatePreview);
chapterTitle.addEventListener("input",updatePreview);
chapterNumber.addEventListener("input",updatePreview);
storyContent.addEventListener("input",updatePreview);

updatePreview();

// ===============================
// Statistics
// ===============================

function updateStats(){

    const text = storyContent.value.trim();

    const words =
    text===""
    ?0
    :text.split(/\s+/).length;

    wordCount.textContent = words;

    charCount.textContent =
    storyContent.value.length;

    const minutes =
    Math.max(1,Math.ceil(words/200));

    readingTime.textContent =
    minutes + " min";

}

storyContent.addEventListener(
    "input",
    updateStats
);

updateStats();

// ===============================
// Clear Editor
// ===============================

clearBtn.addEventListener("click",()=>{

    if(!confirm("Clear the current story?"))
        return;

    currentStoryId = null;

    storyTitle.value = "";
    chapterTitle.value = "";
    chapterNumber.value = "";
    storyContent.value = "";

    updatePreview();
    updateStats();

});

// ===============================
// Download Story
// ===============================

downloadBtn.addEventListener("click",()=>{

    const content =

`Title : ${storyTitle.value}

Chapter : ${chapterNumber.value}

${chapterTitle.value}

--------------------------------------------

${storyContent.value}`;

    const blob =
    new Blob(
        [content],
        {
            type:"text/plain"
        }
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    (storyTitle.value || "Story")
    + ".txt";

    link.click();

    URL.revokeObjectURL(link.href);

});

// ===============================
// Initialize
// ===============================

updatePreview();
updateStats();

/*=========================================================
    EVXY STORY WRITER
    JAVASCRIPT PART 2
    Save • Load • Delete • Search Stories
=========================================================*/

// ===============================
// Local Storage Helpers
// ===============================

function getStories(){

    return JSON.parse(
        localStorage.getItem("evxy_stories")
    ) || [];

}

function saveStories(stories){

    localStorage.setItem(
        "evxy_stories",
        JSON.stringify(stories)
    );

}

// ===============================
// Save Story
// ===============================

saveBtn.addEventListener("click",()=>{

    if(storyTitle.value.trim()===""){

        alert("Please enter a Story Title.");

        storyTitle.focus();

        return;

    }

    let stories = getStories();

    const storyData={

        id: currentStoryId || Date.now(),

        title: storyTitle.value,

        chapterTitle: chapterTitle.value,

        chapterNumber: chapterNumber.value,

        content: storyContent.value,

        date:new Date().toLocaleString()

    };

    if(currentStoryId){

        const index=stories.findIndex(
            s=>s.id===currentStoryId
        );

        if(index!==-1){

            stories[index]=storyData;

        }

    }

    else{

        stories.unshift(storyData);

        currentStoryId=storyData.id;

    }

    saveStories(stories);

    renderStories();

    showToast("Story Saved Successfully!");

});

// ===============================
// Render Stories
// ===============================

function renderStories(){

    const stories=getStories();

    storyList.innerHTML="";

    if(stories.length===0){

        storyList.innerHTML=
        "<p style='opacity:.7;'>No Saved Stories</p>";

        return;

    }

    stories.forEach(story=>{

        const card=document.createElement("div");

        card.className="storyCard";

        card.innerHTML=`

        <div class="storyTitle">

            ${story.title}

        </div>

        <div class="storyDate">

            ${story.date}

        </div>

        `;

        // Open Story

        card.addEventListener("click",()=>{

            openStory(story.id);

        });

        // Delete Button

        const deleteBtn=document.createElement("button");

        deleteBtn.innerHTML="🗑";

        deleteBtn.style.marginTop="12px";

        deleteBtn.style.padding="8px 14px";

        deleteBtn.style.border="none";

        deleteBtn.style.borderRadius="10px";

        deleteBtn.style.cursor="pointer";

        deleteBtn.style.background="#ff4b5c";

        deleteBtn.style.color="white";

        deleteBtn.style.fontSize="15px";

        deleteBtn.addEventListener("click",(e)=>{

            e.stopPropagation();

            deleteStory(story.id);

        });

        card.appendChild(deleteBtn);

        storyList.appendChild(card);

    });

}

// ===============================
// Open Story
// ===============================

function openStory(id){

    const stories=getStories();

    const story=stories.find(
        s=>s.id===id
    );

    if(!story) return;

    currentStoryId=story.id;

    storyTitle.value=story.title;

    chapterTitle.value=story.chapterTitle;

    chapterNumber.value=story.chapterNumber;

    storyContent.value=story.content;

    updatePreview();

    updateStats();

}

// ===============================
// Delete Story
// ===============================

function deleteStory(id){

    if(!confirm("Delete this story?"))
        return;

    let stories=getStories();

    stories=stories.filter(
        s=>s.id!==id
    );

    saveStories(stories);

    renderStories();

}

// ===============================
// Search Stories
// ===============================

searchStory.addEventListener("input",()=>{

    const keyword=
    searchStory.value.toLowerCase();

    const cards=
    document.querySelectorAll(".storyCard");

    cards.forEach(card=>{

        const title=
        card.querySelector(".storyTitle")
        .textContent
        .toLowerCase();

        if(title.includes(keyword)){

            card.style.display="block";

        }

        else{

            card.style.display="none";

        }

    });

});

// ===============================
// Initial Load
// ===============================

renderStories();

/*=========================================================
    EVXY STORY WRITER
    JAVASCRIPT PART 3
    Auto Save • Draft Restore • Ctrl+S • Toast
=========================================================*/

// ===============================
// Toast Notification
// ===============================

const toast=document.createElement("div");

toast.style.position="fixed";
toast.style.bottom="30px";
toast.style.right="30px";
toast.style.padding="15px 22px";
toast.style.background="#1f7cff";
toast.style.color="white";
toast.style.borderRadius="12px";
toast.style.fontWeight="600";
toast.style.boxShadow="0 10px 25px rgba(0,0,0,.3)";
toast.style.opacity="0";
toast.style.transition=".35s";
toast.style.zIndex="99999";

document.body.appendChild(toast);

function showToast(message){

    toast.textContent=message;

    toast.style.opacity="1";

    setTimeout(()=>{

        toast.style.opacity="0";

    },2200);

}

// ===============================
// Draft System
// ===============================

function saveDraft(){

    const draft={

        title:storyTitle.value,

        chapterTitle:chapterTitle.value,

        chapterNumber:chapterNumber.value,

        content:storyContent.value

    };

    localStorage.setItem(

        "evxy_draft",

        JSON.stringify(draft)

    );

}

function loadDraft(){

    const draft=

    JSON.parse(

    localStorage.getItem("evxy_draft")

    );

    if(!draft) return;

    storyTitle.value=draft.title||"";

    chapterTitle.value=draft.chapterTitle||"";

    chapterNumber.value=draft.chapterNumber||"";

    storyContent.value=draft.content||"";

    updatePreview();

    updateStats();

}

loadDraft();

// ===============================
// Auto Save Draft
// ===============================

setInterval(()=>{

    saveDraft();

},5000);

// ===============================
// Save On Typing
// ===============================

storyTitle.addEventListener("input",saveDraft);

chapterTitle.addEventListener("input",saveDraft);

chapterNumber.addEventListener("input",saveDraft);

storyContent.addEventListener("input",saveDraft);

// ===============================
// Ctrl + S Shortcut
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        saveBtn.click();

    }

});

// ===============================
// Welcome Message
// ===============================

setTimeout(()=>{

showToast("Welcome to Evxy Story Writer ✨");

},700);

// ===============================
// Unsaved Changes Warning
// ===============================

window.addEventListener("beforeunload",(e)=>{

    saveDraft();

});

// ===============================
// Reading Progress
// ===============================

const progress=document.createElement("div");

progress.style.position="fixed";

progress.style.left="0";

progress.style.top="0";

progress.style.height="4px";

progress.style.width="0%";

progress.style.background="#56b7ff";

progress.style.zIndex="999999";

document.body.appendChild(progress);

storyContent.addEventListener("scroll",()=>{

    const total=

    storyContent.scrollHeight-

    storyContent.clientHeight;

    const percent=

    (storyContent.scrollTop/total)*100;

    progress.style.width=

    percent+"%";

});

// ===============================
// Empty Story Reminder
// ===============================

storyContent.addEventListener("blur",()=>{

    if(

        storyContent.value.trim()===""

    ){

        showToast(

        "Your story is empty."

        );

    }

});

// ===============================
// Final Initialization
// ===============================

updatePreview();

updateStats();

renderStories();

showToast("Evxy Story Ready 🚀");