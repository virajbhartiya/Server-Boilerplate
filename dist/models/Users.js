"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const UserSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        trim: true,
    },
    last_name: {
        type: String,
        trim: true,
    },
    emailId: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    photo: String,
    mobile_number: String,
    fav_club: String,
    profile_photo: {
        type: String,
        default: "default.png",
    },
    dob: String,
    user_team: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
    },
    hashed_password: {
        type: String,
    },
    salt: {
        type: String,
    },
    resetPasswordLink: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
    // toJSON: { virtuals: true },
});
UserSchema.virtual("password")
    .set(function (password) {
    this._password = password;
    this.salt = this.makesalt();
    this.hashed_password = this.encrptPassword(password);
})
    .get(function () {
    return this._password;
});
UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encrptPassword(plainText) === this.hashed_password;
    },
    encrptPassword: function (password) {
        if (!password)
            return "";
        try {
            return crypto_1.default
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        }
        catch (err) {
            return "";
        }
    },
    makesalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + "";
    },
};
UserSchema.set("toJSON", { virtuals: true });
const UserModel = mongoose_1.default.model("Users", UserSchema);
// UserModel.watch().on("delete", (data) => console.log(new Date(), data));
exports.default = UserModel;
//# sourceMappingURL=Users.js.map