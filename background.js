/*
AI DISCLAIMER: The following code was generated with the assistance of ChatGPT and modified/tested by a human developer.
*/

const background = document.querySelector(".background");

if (background) {
    const layers = [ // "density" is per 10000px², so we need to calculate the number of stars based on the actual area of the background
        { selector: ".stars--small", density: 2.5 },
        { selector: ".stars--medium", density: 1 },
        { selector: ".stars--large", density: 0.3 }
    ];

    function generateStars(width, height, density) {
        const shadows = [];
        const count = Math.floor(((width * height) / 10000) * density);

        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;

            shadows.push(
                `${x.toFixed(1)}px ${y.toFixed(1)}px white`
            );
        }

        return shadows.join(", ");
    }

    function updateBackground() {
        const width = background.clientWidth;
        const height = background.clientHeight;

        background.style.setProperty(
            "--tile-height",
            `${height}px`
        );

        for (const layer of layers) {
            const element = background.querySelector(
                layer.selector
            );

            if (!element) continue;

            const shadows = generateStars(
                width,
                height,
                layer.density
            );

            element.style.setProperty(
                "--star-shadows",
                shadows
            );
        }
    }

    updateBackground();


    // ----- Event Listeners -----
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            updateBackground();
        }, 200);
    });
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            updateBackground();
        }
    });
}
