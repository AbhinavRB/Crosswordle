document.addEventListener("DOMContentLoaded", () => {

    const heading = document.getElementById("main-heading");
    const subtext = document.getElementById("subtext");
    const header = document.querySelector(".header");
    const confetti = document.getElementById("confetti");

    let gameFinished = false;

    function checkGameCompletion() {
        const allWords = document.querySelectorAll(".crossword-word");

        const allComplete = [...allWords].every(word => {
            const cells = word.querySelectorAll(".cell");
            return [...cells].every(cell => cell.classList.contains("locked"));
        });

        if (allComplete && !gameFinished) {
            gameFinished = true;

            // Fade out header
            header.classList.add("header-fade-out");

            setTimeout(() => {
                heading.textContent = "Happy birthday :)";
                subtext.textContent = "Just trying some code, thought this would be a fun thing to do.";

                header.classList.remove("header-fade-out");
                header.classList.add("header-bounce-in");

                if (confetti) {
                    confetti.style.display = "block";
                    confetti.play();
                }

            }, 400);
        }
    }

    document.querySelectorAll(".crossword-word").forEach((container, wordIndex) => {

        const panel = container.closest(".panel");
        const input = container.querySelector(".hidden-input");
        const cells = container.querySelectorAll(".cell");
        const checkButton = panel.querySelector(".check-button");

        const length = cells.length;
        const solution = container.dataset.solution.toUpperCase();

        let letters = Array(length).fill("");
        let locked = Array(length).fill(false);
        let cursorIndex = 0;

        // Focus first word automatically
        if (wordIndex === 0) {
            input.focus();
        }

        container.addEventListener("mousedown", () => {
            input.focus();
        });

        function render() {
            const allLocked = locked.every(val => val === true);

            cells.forEach((cell, i) => {
                cell.textContent = letters[i];
                cell.classList.toggle("locked", locked[i]);

                if (!allLocked) {
                    cell.classList.toggle("active", i === cursorIndex);
                } else {
                    cell.classList.remove("active");
                }
            });
        }

        function moveCursor(direction) {
            let newIndex = cursorIndex;

            do {
                newIndex += direction;
            } while (
                newIndex >= 0 &&
                newIndex < length &&
                locked[newIndex]
            );

            if (newIndex >= 0 && newIndex < length) {
                cursorIndex = newIndex;
            }
        }

        input.addEventListener("keydown", (e) => {

            if (e.key === "ArrowRight") {
                moveCursor(1);
                render();
                return;
            }

            if (e.key === "ArrowLeft") {
                moveCursor(-1);
                render();
                return;
            }

            if (e.key === "Backspace") {
                e.preventDefault();

                if (!locked[cursorIndex] && letters[cursorIndex] !== "") {
                    letters[cursorIndex] = "";
                } else {
                    moveCursor(-1);
                    if (!locked[cursorIndex]) {
                        letters[cursorIndex] = "";
                    }
                }

                render();
                return;
            }

            if (/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();

                if (!locked[cursorIndex]) {
                    letters[cursorIndex] = e.key.toUpperCase();
                    moveCursor(1);
                    render();
                }
            }
        });

        // Click-to-focus per cell
        cells.forEach((cell, index) => {
            cell.addEventListener("click", (e) => {
                e.stopPropagation();

                if (!locked[index]) {
                    cursorIndex = index;
                } else {
                    let i = index;
                    while (i < length && locked[i]) i++;
                    if (i < length) {
                        cursorIndex = i;
                    }
                }

                input.focus();
                render();
            });
        });

        if (checkButton) {
            checkButton.addEventListener("click", () => {
                for (let i = 0; i < length; i++) {
                    if (letters[i] === solution[i]) {
                        locked[i] = true;
                    }
                }

                render();
                checkGameCompletion();
            });
        }

        render();

    });

});