const flowerContainer = document.getElementById("flowers");

// Create Falling Flowers

function createFlower(){

    const flower = document.createElement("div");

    flower.className = "flower";

    const flowers = ["🌸","🌼","🪷","🌺","💐","🌹"];

    flower.innerHTML = flowers[Math.floor(Math.random()*flowers.length)];

    flower.style.left = Math.random()*100 + "vw";

    flower.style.fontSize = (18 + Math.random()*18) + "px";

    flower.style.animationDuration = (6 + Math.random()*5) + "s";

    flower.style.opacity = Math.random();

    flowerContainer.appendChild(flower);

    setTimeout(()=>{
        flower.remove();
    },11000);

}

setInterval(createFlower,250);

// Button Click

document.getElementById("enterBtn").addEventListener("click", function(e){

    e.preventDefault();

    window.location.href = "write.html";

});
