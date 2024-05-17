const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $(".header__title");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "You Don't Know Me",
            singer: "Ofenbach, Brodie Barclay (RinV Remix)",
            path: "./assets/music/song-1.mp3",
            image: "./assets/img/song-1.png",
        },
        {
            name: "Cẩm tú cầu",
            singer: "Rayo x Huỳnh Văn (Kiều Chi Cover)",
            path: "./assets/music/song-2.mp3",
            image: "./assets/img/song-2.png",
        },
        {
            name: "Summertime",
            singer: "BTTN Remix ft. Lana Del Rey",
            path: "./assets/music/song-3.mp3",
            image: "./assets/img/song-3.png",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${
                    index === this.currentIndex ? "active" : ""
                }" data-index = ${index}>
                    <div class="thumb" style="background-image: url('${
                        song.image
                    }')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });

        playList.innerHTML = htmls.join("");
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý cd quay / dừng
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );

        cdThumbAnimate.pause();

        // Xử lý phóng to/thu nhỏ CD
        document.onscroll = () => {
            const scrollY =
                window.scrollY || document.documentElement.scrollTop;

            const newCdWidth = cdWidth - scrollY;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý nút Play
        playBtn.onclick = () => {
            _this.isPlaying = !_this.isPlaying;

            if (_this.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        };

        // Khi song được play
        audio.onplay = function () {
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song được pause
        audio.onpause = function () {
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        //Khi tua song
        progress.onchange = function () {
            const seekTime = (progress.value * audio.duration) / 100;
            audio.currentTime = seekTime;
        };

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        //  Xử lý bật tắt random Song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            if (_this.isRandom) {
                randomBtn.classList.add("active");
            } else {
                randomBtn.classList.remove("active");
            }
        };

        //  Xử lý lặp lại Song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            if (_this.isRepeat) {
                repeatBtn.classList.add("active");
            } else {
                repeatBtn.classList.remove("active");
            }
        };

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Lắng nghe hành vi click vào playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        const activeSong = document.querySelector(".song.active");
        setTimeout(function () {
            activeSong.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }, 300);
    },

    start: function () {
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
    },
};

app.start();
