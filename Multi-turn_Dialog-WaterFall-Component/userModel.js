class UserModel {
    constructor (transport, name, age) {
        this.name = name;
        this.age = age;
        this.transport = transport;

    }
}

module.exports.UserModel = UserModel;