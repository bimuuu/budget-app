// 1. เลือก Element จาก HTML มาเก็บไว้ในตัวแปร
const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 2. สร้าง Array เพื่อเก็บข้อมูลรายการทั้งหมด
let transactions = [];

// 3. ฟังก์ชันสำหรับเพิ่มรายการในหน้าเว็บ
function addTransactionDOM(transaction) {

    const sign = transaction.amount < 0 ? '-' : '+'; // ตรวจสอบว่าเป็นบวกหรือลบ
    const item = document.createElement('li'); // สร้าง <li> ขึ้นมาใหม่

    // ใส่ Class ตามประเภทเงิน (รายรับ/รายจ่าย)
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus'); // 2. ใส่สีแดงหรือเขียว
    
    // full if-else
    // if(transaction.amount < 0){
    //     item.classList.add('minus') //true
    // } else {
    //     item.classList.add('plus') //false
    // }

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    `; // 3. เขียนข้อความลงไปในกิ่งนั้น
    //abs = absolute - เป็น + เสมอ
    // transaction.text + "<span>" + sign + Math.abs(transaction.amount) + "</span>"

    list.appendChild(item); // 4. เอากิ่ง <li> ไปแปะไว้ในต้นไม้ใหญ่ <ul>
}

// 4. ฟังก์ชันคำนวณยอดเงินรวม
function updateValues() {
    const amounts = transactions.map(t => t.amount); // ดึงมาเฉพาะตัวเลข
                                //(ผลรวมสะสม, รายการปัจจุบัน) => { การคำนวณ }, ค่าเริ่มต้น
                                //acc = Accumulator
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);// บวกเลขทั้งหมดเข้าด้วยกัน
    balance.innerText = `฿${total}`;
}

// 5. เหตุการณ์เมื่อกดปุ่ม Submit ฟอร์ม
form.addEventListener('submit', (e) => {
    e.preventDefault(); // สำคัญมาก! กันไม่ให้หน้าเว็บรีเฟรชเอง

    const newTransaction = {
        //
        id: Math.floor(Math.random() * 1000000), 
        text: text.value,
        amount: +amount.value // ใส่เครื่องหมาย + เพื่อแปลง String เป็น Number
    };

    transactions.push(newTransaction); // 1. เก็บข้อมูลเข้า "โกดัง" (Array)
    addTransactionDOM(newTransaction); // 2. "วาด" ข้อมูลนั้นลงบนหน้าเว็บให้คนเห็น
    updateValues(); // 3. "คำนวณเงินใหม่" ทั้งหมด เพื่อโชว์ยอดคงเหลือล่าสุด

    text.value = ''; // ล้างช่องกรอกข้อมูล
    amount.value = '';
});