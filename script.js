jQuery(function ($) {
    let gameArea = $("#jatekTer");
    let line = $("#line");
    let kulso = $("#kulso");

    // kep src-k
    let img_p = "piros.png";
    let img_k = "kek.png";
    let img_z = "zold.png";
    let img_s = "sarga.png";

    // szintlepeshez szukseges adatok
    let level = 1;
    let n = 3;
    let t = 500;

    let szinek = [img_s, img_z, img_k, img_p];

    function valaszt() {
        let index = Math.floor(Math.random() * szinek.length);
        return szinek[index];
    }

    let domTabla = [[]];
    let vonal = [];

    // kiindulasi allapot
    function kiindulas() {
        for (let i = 0; i < 15; i++) {
            const oszlop = '<div class="oszlop" id="oszlop' + i + '"></div>';
            $(gameArea).append(oszlop);
        }
        // oszlop
        for (let i = 0; i < 15; i++) {
            domTabla[i] = [];
            // sor
            for (let j = 0; j < 4; j++) {
                let szin = valaszt();
                let adott = "";
                if (szin === img_p) {
                    adott = "<img class='piros' src=" + szin + ">";
                } else if (szin === img_z) {
                    adott = "<img class='zold' src=" + szin + ">";
                } else if (szin === img_s) {
                    adott = "<img class='sarga' src=" + szin + ">";
                } else {
                    adott = "<img class='kek' src=" + szin + ">";
                }
                img = $(adott);
                $("#oszlop" + i).prepend(img);
                domTabla[i][j] = img;
            }
        }
        kattint();
    }


    function ujsor() {
        let i = 0;
        const id = setInterval(function () {
            let szin = valaszt();
            let adott = "";
            if (szin === img_p) {
                adott = "<img class='piros' src=" + szin + ">";
            } else if (szin === img_z) {
                adott = "<img class='zold' src=" + szin + ">";
            } else if (szin === img_s) {
                adott = "<img class='sarga' src=" + szin + ">";
            } else {
                adott = "<img class='kek' src=" + szin + ">";
            }
            img = $(adott);
            $("#line").append(img);
            vonal.push(img);

            if (i === 14) {
                betolt();
                clearInterval(id);
            }
            i++;
        }, t);
    }

    function betolt() {
        setTimeout(() => {
            for (let i = 0; i < 15; i++) {
                img = vonal[i];
                $("#oszlop" + i).append(img);
                domTabla[i].unshift(img);
            }
            vonal = [];
            kattint();
        }, 200);
        clearTimeout();
    }

    // ---------------------------------------------------------------------------

    let nem_lehet = 0;
    function lines(szam) {
        let i = 0;
        let x = szam;
        $('#ide span').text(x)

        let val = setInterval(function () {
            i++;
            if(i !== szam) {
                gameover();
                if(veszitett === 1) {
                    clearInterval(val);
                    return;
                }else {
                    ujsor();
                }
            }
            x -= 1;
            $('#ide span').text(x);
            if (i === szam) {
                if(veszitett === 0) {
                    $('#ide span').text("0");
                    clearInterval(val);
                    level += 1; // szint novelese
                    $('#ide3 span').text(level);
                    n = n + 2; // szintenkent 2-vel tobb sort kell betolteni
                    nem_lehet = 1;

                    if(level % 2 === 0 && t > 100) {
                        t -= 100;
                    }
                    nextL();
                    return;
                }
            }
        }, (t*15) + 200);
    }

    function nextL() {
        let nextlevel = $('<div class="next"><div id="nextlevel" class="gomb">NEXT LEVEL</div></div>');
        kulso.append(nextlevel);

        $('.gomb').on("click", function () {
            for (let k = 0; k < 15; k++) {
                for (let l = 0; l < 20; l++) {
                    $('#oszlop' + k).remove();
                }
            }
            domTabla = [[]];

            nem_lehet = 0;

            torlendo = [];
            pont = 0;

            $('.next').hide();

            kiindulas();
            szint();
        });
    }

    // ---------------------------------------------------------------

    let torlendo = [];
    let pont = 0;

    // kattintas
    function kattint() {
        if(veszitett !== 1 && nem_lehet !== 1) {
            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 20; j++) {
                    if (domTabla[i][j] === undefined) {
                        break;
                    }
                    $(domTabla[i][j]).unbind("click"); // leszedi a click eventet
                    $(domTabla[i][j]).on("click", function (event) { // ujra rarakja
                        if (event.hasOwnProperty("originalEvent")) {
                            // Mouse click
                            //console.log("Mouse click")
                            torlendo.push(domTabla[i][j]);
                            szomszedok(i, j);
                            torles();
                        } else {
                            // Function call
                            torlendo.push(domTabla[i][j]);
                            szomszedok(i, j);
                        }
                    });
                }
            }
        }
    }

    // torles
    function torles() {
        if (veszitett !== 1 && nem_lehet !== 1) {

            pont = torlendo.length;

            let obj = document.createElement('audio');
            obj.src = 'event.mp3';
            obj.play();

            for (let i = 0; i < torlendo.length; i++) {
                $(torlendo[i]).animate({
                    opacity: 0
                }, 300);
            }


            setTimeout(function () {
                for (let k = 0; k < torlendo.length; k++) {
                    for (let i = 0; i < 15; i++) {
                        for (let j = 0; j < 20; j++) {
                            if (domTabla[i][j] === undefined) {
                                break;
                            }
                            if (torlendo[k] === domTabla[i][j]) {
                                $(domTabla[i][j]).remove();
                                domTabla[i].splice(j, 1);
                            }
                        }
                    }
                }
                torlendo = [];
                pontszam();
                kattint();
            }, 300);
        }
    }


    // score
    let osszes = 0;
    function pontszam() {
        $('.pont').remove();
        osszes += pont ** 2;
        $('#ide2 span').text(osszes);
    }

    function szint() {
        $('#ide3 span').text(level);
        ujsor();
        lines(n);
    }

    // ---------------------------------------------------------------

    // aktualis elem idexeit kapja
    // i: oszlop
    // j: sor
    function szomszedok(i, j) {
        if(nem_lehet !== 1) {
            const szin = $(domTabla[i][j]).attr("class");
            // fent
            if (j < 19 && domTabla[i][j + 1] !== undefined && torlendo.includes(domTabla[i][j + 1]) === false && $(domTabla[i][j + 1]).hasClass(szin)) {
                domTabla[i][j + 1].trigger('click');
            }
            // lent
            if (j > 0 && domTabla[i][j - 1] !== undefined && torlendo.includes(domTabla[i][j - 1]) === false && $(domTabla[i][j - 1]).hasClass(szin)) {
                domTabla[i][j - 1].trigger('click');
            }
            // bal
            if (i > 0 && domTabla[i - 1][j] !== undefined && torlendo.includes(domTabla[i - 1][j]) === false && $(domTabla[i - 1][j]).hasClass(szin)) {
                domTabla[i - 1][j].trigger('click');
            }
            // jobb
            if (i < 14 && domTabla[i + 1][j] !== undefined && torlendo.includes(domTabla[i + 1][j]) === false && $(domTabla[i + 1][j]).hasClass(szin)) {
                domTabla[i + 1][j].trigger('click');
            }
        }
    }


    let veszitett = 0;
    function gameover() {
        let go = '';
        let top = '';
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 20; j++) {
                if(domTabla[i][j] !== undefined && j === 18) {
                    veszitett = 1;
                    let egyszer = 0;

                    go = $('<div class="gameover">GAME OVER<div id="gameover" class="gomb1">START NEW GAME</div></div>');
                    kulso.append(go);

                    let g_over = document.createElement('audio');
                    g_over.src = 'gameover.mp3';
                    g_over.play();
                    //console.log('GAME OVER');

                    $('.gomb1').on("click", function () {
                        for (let k = 0; k < 15; k++) {
                            for (let l = 0; l < 20; l++) {
                                $('#oszlop' + k).remove();
                            }
                        }
                        domTabla = [[]];
                        $('.gameover').hide();
                        $('.pont').remove();
                        veszitett = 0;
                        osszes = 0;
                        $('#ide2 span').text(osszes);
                        n = 3;
                        level = 1;
                        t = 500;
                        jatek();
                    });
                    top = $('<div id="toplista_gomb" class="gomb2">TOPLIST</div>');
                    $('.gameover').append(top);
                    $('.gomb2').on("click", function () {
                        if (egyszer === 0) {
                            let person = prompt("Adja meg a nevét:", "anonymus");
                            localStorage.setItem(person, osszes);

                            toplista_feltoltes();
                            egyszer = 1;
                        }
                    });
                        return 1;
                }
            }
        }
    }

    function toplista_feltoltes() {
        let adat = [];
        for (let i = 0; i < localStorage.length; i++) {
            adat[i] = [localStorage.key(i), parseInt(localStorage.getItem(localStorage.key(i)))];
        }
        // csokkeno sorrend
        adat.sort(function (a, b) {
            return b[1] - a[1];
        });
        // 10 legtobb pont
        for (let elem of adat.keys()) {
            if (elem < 10) {
                let listaelem = $("<li>" + adat[elem][0] + " - " + adat[elem][1] + "</li>")
                $('#lista').append(listaelem)
            }
        }
    }


    function jatek() {
        kiindulas();
        szint();
    }


    let zene = document.getElementById("zene");

    $(document).ready(function () {
        //localStorage.clear();
        st = $('<div class="start"><div id="startgame" class="gomb">START NEW GAME</div></div>');
        kulso.append(st);
        $('.gomb').on("click", function () {
            //domTabla = [[]];
            $('.start').hide();
            $('.pont').remove();
            $('#ide3 span').text(level);
            n = 3;
            level = 1;
            t = 500;
            zene.autoplay = true;
            zene.load();
            jatek();
        });
    });

})
