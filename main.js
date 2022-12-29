const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Sơn Tùng - MTP',
            singer: 'Hãy trao cho anh',
            path: './assets/music/HayTraoChoAnh.mp3',
            image: './assets/img/Hay-Trao-Cho-Anh.jpg'
        },
        {
            name: 'Sơn Tùng - MTP',
            singer: 'Muộn rồi mà sao còn',
            path: './assets/music/MuonRoiMaSaoCon.mp3',
            image: './assets/img/Muộn_rồi_mà_sao_còn.png'
        },
        {
            name: 'Mono',
            singer: 'Em là',
            path: './assets/music/EmLa.mp3',
            image: './assets/img/EmLA.jpg'
        },
        {
            name: 'Hiếu thứ 2',
            singer: 'Lời Đường Mật',
            path: './assets/music/LoiDuongMat.mp3',
            image: './assets/img/LờiĐườngMật.jpg'
        },
        {
            name: 'Only C',
            singer: 'Người Đáng Thương Là Anh',
            path: './assets/music/NguoiDangThuongLaAnh.mp3',
            image: './assets/img/NguoiDangThuongLaAnh.jpg'
        },
        {
            name: 'Ronboogz',
            singer: 'Khi mà',
            path: './assets/music/KhiMa.mp3',
            image: './assets/img/KhiMa.jpg'
        },
        {
            name: 'TLinh, Grey D',
            singer: 'Xích thêm chút nữa',
            path: './assets/music/XichThemChutNua.mp3',
            image: './assets/img/Xíchthêmchútnữa.jpg'
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>                         
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function () {
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 6 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi song được play 
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song bị pause 
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next bài hát
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // Khi prev bài hát
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // Khi random bài hát
        randomBtn.onclick = function (e) {
            app.isRandom = !(app.isRandom);
            randomBtn.classList.toggle('active', app.isRandom);
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xử lý repeat bài hát
        repeatBtn.onclick = function() {
            app.isRepeat = !(app.isRepeat);
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if(songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    console.log(app.currentIndex);
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
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
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
            console.log(newIndex);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'start',
            })
        }, 200)
    },

    start: function () {
        // Định nghĩa các thuộc tính cho obj
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM event)
        this.handleEvent();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //  Render playlist
        this.render();
    }
};

app.start();
