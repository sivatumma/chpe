function meeting(meeting, time1, time2) {
    this.meeting = meeting;
    this.start_time = time1;
    this.end_time = time2;
}


meeting.prototype.convert = function (a) {
    var b = this[a + '_time'];
    var start = b.slice(0, 3);
    var min = parseInt(b.slice(3, 5));
    min = a == "start" ? min - 1 : min + 1;
    min = min < 10 ? "0" + min : min;
    var ending = b.slice(5, 8);

    return start + min + ending

}

Array.prototype.getFreeTime = function () {
    var l = this.length,
        withFreeTime = [],
        i = 0;
    while (i < l) {

        var s = this[i - 1] ? this[i - 1].convert('end') : "00:00:00";
        withFreeTime.push(new meeting('freetime', s, this[i].convert('start')));
        withFreeTime.push(this[i]);
        i++;
    }

    //to add the freetime from "18:16:00" to  "23:59:00":
    withFreeTime.push(new meeting('freetime', this[i-1].convert('end'),'23:59:00'));

    return withFreeTime;
}

var meetings = [];
meetings[0] = new meeting('meeting1', "01:00:00", "07:15:00");
meetings[1] = new meeting('meeting2', "07:16:00", "08:15:00");
meetings[2] = new meeting('meeting3', "10:16:00", "11:15:00");
meetings = meetings.getFreeTime();

// console.log(meetings);

meetings.forEach(function(x){
    console.log(x.meeting == 'freetime' ? x : '');
});