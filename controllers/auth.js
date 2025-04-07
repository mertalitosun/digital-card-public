const Users = require("../models/users");
const Roles = require("../models/roles");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {sendMail} = require("../helpers/nodemailer")
const {formatName} = require("../helpers/formatName")
const randomId = (code) => {
    id = crypto.randomBytes(4).toString("hex").toUpperCase();

    return code + id
};

const passwordValidation = (password) => {
    
    const lengthRegex = /.{8,}/;
    const upperCaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    const specialCharacterRegex = /[.!Q#$%^&*,.?:|<>]/;

    if(!lengthRegex.test(password)){
        return "Şifre en az 8 karakter olmalıdır.";
    }

    if(!upperCaseRegex.test(password)){
        return "Şifre en az bir büyük harf içermelidir.";
    }

    if(!numberRegex.test(password)){
        return "Şifre en az bir rakam içermelidir.";
    }

    if(!specialCharacterRegex.test(password)){
        return "Şifre en az bir belirtilen özel karakterlerden içermelidir."
    }
    return null;
}

exports.post_password_reset = async (req,res) => {
    const { token, newPassword,confirmPassword} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findByPk(decoded.userId);
        
        if (!user) {
            return res.render("auth/password-reset",{
                title: "Şifre Sıfırlama",
                message: {type: "danger", text: "Kullanıcı Bulunamadı"}
            });
        }

        const passwordError = passwordValidation(newPassword);

        if(passwordError){
            return res.render("auth/password-reset",{
                title:"Şifre Sıfırlama",
                message:{type: "warning", text:passwordError}
            })
        }
        if(newPassword !== confirmPassword){
            return res.render("auth/password-reset",{
                title: "Şifre Sıfırlama",
                message:{type:"warning",text:"Yeni şifreniz ve şifre tekrarı uyuşmadı."}
            });
        }

        if(newPassword == confirmPassword){
            user.password = await bcrypt.hash(confirmPassword,10);
            await user.save();
            req.flash("success", "Şifreniz başarıyla değiştirildi.");
            (async () => {
                const type = "info"
                const to = user.email
                const subject = "Şifre Değiştirildi";
                const templateName = "password-reset-success";
                const variables = {
                    EMAIL_SUBJECT: subject,
                    EMAIL_CONTENT : `Şifreniz başarıyla değiştirildi. Aşağıdaki linke tıklayarak giriş yapabilirsiniz.`,
                    resetLink: `https://infinitetag.com/login`,
                    resetText : "Giriş Yap"
                };
                await sendMail(type, to, subject, templateName, variables);
            })();
            res.redirect("/login");
        }
    } catch (err) {
        return res.status(400).json({ message: "Geçersiz token veya hata oluştu." });
    }
}
exports.get_password_reset = async (req,res) => {
    const { token } = req.query;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findByPk(decoded.userId);
        
        if (!user) {
            return res.render("auth/forgot-password",{
                title: "Şifre Sıfırlama",
                message: {type: "danger", text: "Kullanıcı Bulunamadı"}
            });
        }
        res.render("auth/password-reset",{
            title: "Şifre Belirleme",
            token
        });
    } catch (err) {
        return res.status(400).render("auth/forgot-password",{ title: "Şifre Sıfırlama", message:{type: "danger", text: "Geçersiz veya süresi dolmuş token."}});
    }
}

exports.post_forgot_password = async (req,res) => {
    const email = req.body.email;
    try {
        const user = await Users.findOne({
            where: {
                email: email
            },include:{
                model:Roles
            }
        });
        if (!user) {
            return res.render("auth/forgot-password", {
                title: "Şifre Sıfırlama",
                message: {type: "danger", text: "Kullanıcı Bulunamadı"}
            });
        }
        if(user){
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            (async () => {
                const type = "info"
                const to = user.email
                const subject = "Şifre Sıfırlama Talebi";
                const templateName = "password-reset";
                const variables = {
                    EMAIL_SUBJECT: subject,
                    EMAIL_CONTENT : `Aşağıdaki şifre sıfırlama butonunu kullanarak yeni şifreni belirleyebilirsin`,
                    resetLink: `https://infinitetag.com/password-reset?token=${token}&userId=${user.id}`,
                    resetText : "Şifre Sıfırla"
                };
                await sendMail(type, to, subject, templateName, variables);
            })();

            return res.render("auth/forgot-password", {
                title: "Şifre Sıfırlama",
                message: {type: "success", text: "Şifre sıfırlama link gönderildi"}
            });
        }
    }catch (err) {
        console.log(err);
    }
}
exports.get_forgot_password = async (req,res) => {
    try{
        res.render("auth/forgot-password",{
            title: "Şifre Sıfırlama"
        });
    }catch(err){
        console.log(err);
    }
}

exports.post_password_change = async (req,res) => {
    const {userCode} = req.query;
    const {oldPassword,newPassword,confirmPassword} = req.body;
    try{
        const user = await Users.findOne({where:{userCode}});
        if(!user){
            return res.status(404).json({status: 404, message:"Kullanıcı Bulunamadı!"});
        }

        if(!await bcrypt.compare(oldPassword,user.password)){
            return res.render("auth/password-change",{
                title: "Şifre Değiştir",
                message:{type:"danger",text:"Mevcut şifre yanlış!"}
            });
        }


        const passwordError = passwordValidation(newPassword);

        if(passwordError){
            return res.render("auth/password-change",{
                title:"Şifre Değiştir",
                message:{type: "warning", text:passwordError}
            })
        }
        if(newPassword !== confirmPassword){
            return res.render("auth/password-change",{
                title: "Şifre Değiştir",
                message:{type:"warning",text:"Yeni şifreniz ve şifre tekrarı uyuşmadı."}
            });
        }

        if(newPassword == confirmPassword){
            user.password = await bcrypt.hash(confirmPassword,10);
            await user.save();
            req.flash("success", "Şifreniz başarıyla değiştirildi.");
            if (req.session.roles.includes("Admin")) {
                return res.redirect(`/admin/customers`);
              } else if (req.session.roles.includes("Müşteri")) {
                return res.redirect(`/dashboard/my-account`);
              } else {
                return res.status(403).send('Yetkisiz İşlem');
              }
        }
    }catch(err){
        console.log(err.message);
        return res.status(500).render("auth/password-change", {
            title: "Şifre Değiştir",
            message: { type: "warning", text: "Bir hata oluştu. Lütfen tekrar deneyin." }
        });
    }
}
exports.get_password_change = async (req,res) => {
    try{
        res.render("auth/password-change",{
            title: "Şifre Değiştir"
        });
    }catch(err){
        console.log(err);
    }
}

exports.get_register = async (req, res) => {
    try {
        return res.render("auth/register", {
            title: "Kullanıcı Kayıt"
        });
    } catch (err) {
        console.log(err);
    }
};
exports.post_register = async (req, res) => {
    const{name,surname,email,password} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUsers = await Users.findOne({
            where: {
                email: email
            }
        });
        if (existingUsers) {
            return res.render("auth/register", {
                title: "Kullanıcı Kayıt Sayfası",
                message: { type: "warning", text: "Bu e-posta adresi zaten kullanılıyor." }
            });
        }

        let userRoleName = 'Müşteri';
        const users = await Users.findAll();
        if (!users.length) {
            userRoleName = 'Admin';
        }
        let userRole = await Roles.findOne({ where: { name: userRoleName } });
        if (!userRole) {
            userRole = await Roles.create({ name: userRoleName });
        }
        const user = await Users.create({
            userCode:randomId("USR"),
            name: formatName(name),
            surname: formatName(surname),
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        if(userRole){
            await user.addRole(userRole);
        }

        return res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
};

exports.get_login = async (req, res) => {
    try {
        return res.render("auth/login", {
            title: "Kullanıcı Giriş Sayfası"
        });
    } catch (err) {
        console.log(err);
    }
};

exports.post_login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await Users.findOne({
            where: {
                email: email
            },include:{
                model:Roles
            }
        });
        if (!user) {
            return res.render("auth/login", {
                title: "Kullanıcı Giriş Yap Sayfası",
                message: {type: "danger", text: "Kullanıcı Bulunamadı"}
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.isAuth = true;
            req.session.userId = user.id;
            req.session.userCode = user.userCode;
            req.session.fullName = user.name.charAt(0).toUpperCase() + user.name.slice(1) + " " + user.surname.charAt(0).toUpperCase()+ user.surname.slice(1)
            req.session.roles = user.roles.map(role => role.name);

            console.log(req.session.roles)

            if(req.session.roles.includes("Admin")){
                req.session.isAdmin = true;
                req.session.isCustomer = false;
                res.redirect("/admin/customers");
            }
            if(req.session.roles.includes("Müşteri")){
                req.session.isAdmin = false;
                req.session.isCustomer = true;
                res.redirect("/dashboard/my-account");
            }
            
        } else {
            res.render("auth/login", {
                title: "Kullanıcı Giriş Yap Sayfası",
                message: {type: "danger", text: "Hatalı Parola"}
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.get_logout = async (req, res) => {
    await req.session.destroy();
    return res.redirect("/")
};