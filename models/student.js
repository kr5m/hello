class student {
    constructor(name, matriculationNumber, courseID, houseAddress, phoneNumber, email, year, className ) {
        this.name = name;
        this.matriculationNumber = matriculationNumber;
        this.courseID = courseID;
        this.houseAddress = houseAddress;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.year = year;
        this.className = className;
        this.courseID = courseID;
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}
module.exports = { student };