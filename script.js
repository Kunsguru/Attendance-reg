const graceLimit = 10;

        function registerAttendance() {
            const timeElement = document.getElementById('time');
            const time = timeElement.value;
            const reason = document.getElementById('reason').value;
            const workerName = prompt("Please enter your name:");

            if (!workerName) {
                alert("Name is required to register attendance.");
                return;
            }

            const inputTime = new Date();
            inputTime.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]));

            const lateTime = new Date();
            lateTime.setHours(8, 0, 0, 0);

            const isLate = inputTime > lateTime;
            if (isLate) {
                alert("You are late!");
            }

            logAttendance(time, reason, workerName, isLate, 'arrival');
        }

        function recordLeave() {
            const timeElement = document.getElementById('leaveTime');
            const time = timeElement.value;
            const reason = document.getElementById('leaveReason').value;
            const workerName = prompt("Please enter your name:");

            if (!workerName) {
                alert("Name is required to record leave.");
                return;
            }

            let leaveCount = parseInt(localStorage.getItem(`${workerName}_leaveCount`) || '0');
            leaveCount++;

            if (leaveCount > graceLimit) {
                alert("You have exceeded the 10 times grace period for leaving the premises. Please limit your movement.");
            }

            localStorage.setItem(`${workerName}_leaveCount`, leaveCount);
            logAttendance(time, reason, workerName, false, 'leave');

            document.getElementById('leaveForm').style.display = 'none';
        }

        function recordReturn() {
            const timeElement = document.getElementById('returnTime');
            const time = timeElement.value;
            const reason = document.getElementById('returnReason').value;
            const workerName = prompt("Please enter your name:");

            if (!workerName) {
                alert("Name is required to record return.");
                return;
            }

            logAttendance(time, reason, workerName, false, 'return');

            document.getElementById('returnForm').style.display = 'none';
        }

        function recordClosing() {
            const timeElement = document.getElementById('closingTime');
            const time = timeElement.value;
            const reason = document.getElementById('closingReason').value;
            const workerName = prompt("Please enter your name:");

            if (!workerName) {
                alert("Name is required to record closing.");
                return;
            }

            alert("Job well done! Hope to see you tomorrow in sound health. Remember not to be late.");

            logAttendance(time, reason, workerName, false, 'closing');

            document.getElementById('closingForm').style.display = 'none';
        }

        function logAttendance(time, reason, workerName, isLate, type) {
            const logEntry = {
                time,
                reason: reason || "No reason provided",
                workerName,
                type,
                isLate,
                date: new Date().toLocaleDateString()
            };

            const attendanceLog = JSON.parse(localStorage.getItem('attendanceLog')) || [];
            attendanceLog.push(logEntry);
            localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));
        }

        function showLeaveForm() {
            document.getElementById('leaveForm').style.display = 'block';
            document.getElementById('returnForm').style.display = 'none';
            document.getElementById('closingForm').style.display = 'none';
        }

        function showReturnForm() {
            document.getElementById('returnForm').style.display = 'block';
            document.getElementById('leaveForm').style.display = 'none';
            document.getElementById('closingForm').style.display = 'none';
        }

        function showClosingForm() {
            document.getElementById('closingForm').style.display = 'block';
            document.getElementById('leaveForm').style.display = 'none';
            document.getElementById('returnForm').style.display = 'none';
        }

        function promptPassword() {
            const password = prompt("Please enter the password:");
            if (password === 'yourpassword') {
                showRecordBlock();
            } else {
                alert("Incorrect password.");
            }
        }

        function showRecordBlock() {
            document.getElementById('recordBlock').style.display = 'block';

            viewRecords();

            const workers = JSON.parse(localStorage.getItem('workers')) || [];
            const workerList = workers.map(worker => `${worker.name} - ${worker.phone}, ${worker.address}, ${worker.email}`).join('\n') || 'No registered workers.';
            document.getElementById('workerList').textContent = workerList;

            const announcements = localStorage.getItem('announcements') || 'No announcements yet.';
            document.getElementById('announcements').textContent = announcements;
        }

        function closeRecordBlock() {
            document.getElementById('recordBlock').style.display = 'none';
        }

        function viewRecords() {
            const records = JSON.parse(localStorage.getItem('attendanceLog')) || [];
            document.getElementById('records').innerHTML = records.map((record, index) => 
                `${record.date} - ${record.type} - ${record.workerName}: ${record.time} (${record.isLate ? "Late" : "On time"}). Reason: ${record.reason} <button onclick="deleteRecord(${index})" class="delete-button">Delete</button>`
            ).join('<br>') || 'No records found.';
        }

        function deleteRecord(index) {
            const records = JSON.parse(localStorage.getItem('attendanceLog')) || [];
            records.splice(index, 1);
            localStorage.setItem('attendanceLog', JSON.stringify(records));
            viewRecords();
        }

        function makeAnnouncement() {
            const announcementField = document.getElementById('announcement');
            announcementField.style.display = 'block';
            const submitButton = announcementField.nextElementSibling;
            submitButton.style.display = 'block';
        }

        function submitAnnouncement() {
            const announcement = document.getElementById('announcement').value;
            if (!announcement) {
                alert("Please enter an announcement.");
                return;
            }

            const announcements = localStorage.getItem('announcements') || '';
            const newAnnouncements = announcements + '\n' + announcement;
            localStorage.setItem('announcements', newAnnouncements);

            alert("Announcement added.");
            document.getElementById('announcement').value = '';
            document.getElementById('announcement').style.display = 'none';
            document.getElementById('announcement').nextElementSibling.style.display = 'none';
            showRecordBlock();
        }

        function readAnnouncement() {
            const announcements = localStorage.getItem('announcements') || 'No announcements yet.';
            alert(announcements);
        }

        window.addEventListener('unload', sendDailyLog);

        function sendDailyLog() {
            const log = JSON.parse(localStorage.getItem('attendanceLog')) || [];
            if (log.length === 0) {
                console.log("No attendance log to send.");
                return;
            }

            const emailContent = log.map(entry => `${entry.date} - ${entry.type} - ${entry.workerName}: ${entry.time} (${entry.isLate ? "Late" : "On time"}). Reason: ${entry.reason}`).join('\n');
            console.log(`Sending email to mondaykingsley80@gmail.com with the following log:\n${emailContent}`);

            localStorage.removeItem('attendanceLog');
        }
