const Canvas = require("canvas");

const badges = [1, 9]; // min, max

module.exports = class LeaderBoard {
    constructor() {
        this.backgroundColor = "#3E4246"
        this.avatar = `${__dirname}/../assets/default-avatar.png`;
        this.level = "1";
        this.rank = "10";
        this.xp = 8000;
        this.money = "0";
        this.messagesCount = "1254"
        this.primaryColor = "#ffffff";
        this.secondaryColor = "#85878a"
        this.rankBadgeColor = "#989898";
        this.rankName = "rank Name";
        this.username = "username";
    }

    setBackgroundColor(value) {
        this.backgroundColor = value;
        return this;
    }
    setAvatar(value) {
        this.avatar = value;
        return this;
    }
    setLevel(value) {
        this.level = value;
        return this;
    }
    setRank(value) {
        this.rank = value;
        return this;
    }
    setXp(value) {

        const milyon = value / 1000000;
        const milyar = value / 1000000000;
        const trilyon = value / 1000000000000;
        if (trilyon > 1) {
            this.xp = Math.floor(trilyon) + "T";
        } else if (milyar > 1) {
            this.xp = Math.floor(milyar) + "M";
        } else if (milyon > 1) {
            this.xp = Math.floor(milyon) + "M";
        } else {
            this.xp = value;
        }
        return this;
    }
    setMoney(value) {
        const bin = value / 1000;
        const milyon = value / 1000000;
        const milyar = value / 1000000000;
        const trilyon = value / 1000000000000;
        if (trilyon > 1) {
            this.money = Math.floor(trilyon) + "T";
        } else if (milyar > 1) {
            this.money = Math.floor(milyar) + "M";
        } else if (milyon > 1) {
            this.money = Math.floor(milyon) + "M";
        } else if (bin > 1) {

            this.money = Math.floor(bin) + "B";
        } else {
            this.money = value;
        }
        return this;
    }
    setMessageCount(value) {
        const bin = value / 1000;
        const milyon = value / 1000000;
        const milyar = value / 1000000000;
        const trilyon = value / 1000000000000;
        if (trilyon > 1) {
            this.messagesCount = Math.floor(trilyon) + "T";
        } else if (milyar > 1) {
            this.messagesCount = Math.floor(milyar) + "M";
        } else if (milyon > 1) {
            this.messagesCount = Math.floor(milyon) + "M";
        } else if (bin > 1) {

            this.messagesCount = Math.floor(bin) + "B";
        } else {
            this.messagesCount = value;
        }
        return this;
    }
    setPrimaryColor(value) {
        this.primaryColor = value;
        return this;
    }
    setSecondaryColor(value) {
        this.secondaryColor = value;
        return this;
    }
    setRankBadgeColor(value) {
        this.rankBadgeColor = value;
        return this;
    }
    setRankName(value) {
        this.rankName = value;
        return this;
    }
    setUsername(value) {
        this.username = value;
        return this;
    }





    async toAttachment() {
        let canvas = Canvas.createCanvas(1080, 400),
            ctx = canvas.getContext("2d");

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //rank
        ctx.beginPath();
        ctx.arc(35, 30, 13, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.rankBadgeColor;
        ctx.fill();

        ctx.textAlign = 'center'
        ctx.fillStyle = this.primaryColor;
        ctx.font = "11px Arial";
        ctx.fillText(this.rank, 35, 34);

        //username
        ctx.textAlign = 'left'
        ctx.fillStyle = this.primaryColor;
        ctx.font = "15px Arial";
        ctx.fillText(this.username, 130, 25);

        //rank name
        ctx.fillStyle = this.secondaryColor;
        ctx.font = "11px Arial";
        ctx.fillText(this.rankName, 130, 44);


        //Sended Message
        ctx.textAlign = 'center'
        ctx.fillStyle = this.secondaryColor;
        ctx.font = "12px Arial";
        ctx.fillText("Para", 480, 25);

        ctx.textAlign = 'center'
        ctx.fillStyle = this.primaryColor;
        ctx.font = "14px Arial";
        ctx.fillText(this.money, 480, 45);

        //Sended Message
        ctx.textAlign = 'center'
        ctx.fillStyle = this.secondaryColor;
        ctx.font = "12px Arial";
        ctx.fillText("Mesaj Sayısı", 630, 25);

        ctx.textAlign = 'center'
        ctx.fillStyle = this.primaryColor;
        ctx.font = "14px Arial";
        ctx.fillText(this.messagesCount, 630, 45);

        // Point
        ctx.textAlign = 'center'
        ctx.fillStyle = this.secondaryColor;
        ctx.font = "12px Arial";
        ctx.fillText("Tecrübe Puanı", 800, 25);

        ctx.textAlign = 'center'
        ctx.fillStyle = this.primaryColor;
        ctx.font = "14px Arial";
        ctx.fillText(this.xp, 800, 45);

        //level
        ctx.textAlign = 'center'
        ctx.fillStyle = this.secondaryColor;
        ctx.font = "12px Arial";
        ctx.fillText("Seviye", 944, 25);

        ctx.textAlign = 'center'
        ctx.fillStyle = this.primaryColor;
        ctx.font = "14px Arial";
        ctx.fillText(this.level, 944, 45);


        //border
        ctx.beginPath();
        ctx.moveTo(20, 60);
        ctx.lineTo(970, 60);
        ctx.strokeStyle = "#474b50";
        ctx.lineWidth = "2";
        ctx.stroke();

        //profil image
        ctx.beginPath();
        ctx.arc(90, 30, 20, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(this.avatar);
        ctx.drawImage(avatar, 70, 10, 40, 40);
        return canvas;
    }
};