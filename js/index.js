/// <reference types="../@types/jquery" />

let customersData;
let customersTransactionsData;
let tansactionsAmounts=[]
async function getapi() {
    const apiCustomers = await fetch("https://ghanafik.github.io/jop-fair-task/data/db.json");
    const customers = await apiCustomers.json();
    customersData=customers.customers
    customersTransactionsData = customers.transactions;
    let totalTransactions=0
    let content=``
    for(let i=0;i<customersData.length;i++){
        totalTransactions=calculateTotalTransactions(i+1);
        tansactionsAmounts.push([i+1,totalTransactions,customersData[i].name])
        const mybtn=document.createElement('button')
        mybtn.classList.add('btn')
        content+=`
            <tr>
                <td>${i+1}</td>
                <td>${customersData[i].name}</td>
                <td>${totalTransactions}$</td>
                <td><button class="btn btn-primary" onclick="displayTransactionDetails('${i+1}')">Details</button></td>
            </tr>
        `
    }
    $('#customers').html(content)

}
getapi();

function calculateTotalTransactions(id){
    let total=0;
    for(let i=0;i<customersTransactionsData.length;i++){
        if(customersTransactionsData[i].customer_id==id){
            total+=customersTransactionsData[i].amount
        }
    }
    return total
}

function displayTransactionDetails(id){
    $('.graph_details').removeClass('d-none')
    $('.mytable').addClass('d-none')
    $('.search').addClass('d-none')
    $('.title').addClass('d-none')
    let x=[]
    let y=[]
    for(let i=0;i<customersTransactionsData.length;i++){
        if(customersTransactionsData[i].customer_id==id){
            x.push(customersTransactionsData[i].date)
            y.push(customersTransactionsData[i].amount)
        }
    }
    const xValues = x;
    const yValues = y;
    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: yValues
            }]
        },
        options: {
            legend: {display: false},
            scales: {
            yAxes: [{ticks: {min: 100, max:5000}}],
            }
        }
    });
}

$('.graph_details span').on('click',function(){
    $('.graph_details').addClass('d-none')
    $('.mytable').removeClass('d-none')
    $('.search').removeClass('d-none')
    $('.title').removeClass('d-none')
})

$('#searchByName').on('input',function(){
    displayDataByName($(this).val())
})

function displayDataByName(name){
    let content=``
    for(let i=0;i<customersData.length;i++){
        if(customersData[i].name.toLowerCase().includes(name.toLowerCase())){
            totalTransactions=calculateTotalTransactions(i+1);
            content+=`
                <tr>
                <td>${i+1}</td>
                <td>${customersData[i].name}</td>
                <td>${totalTransactions}$</td>
                <td><button class="btn btn-primary" onclick="displayTransactionDetails('${i+1}')">Details</button></td>
            </tr>
            `
        }
    }
    $('#customers').html(content)
}

$('#searchByTransactionsAmount').on('input',function(){
    displayDataTransactionsAmount($(this).val())
})

function displayDataTransactionsAmount(amount){
    let content=``
    for(let i=0;i<tansactionsAmounts.length;i++){
        if(tansactionsAmounts[i][1]==amount){
            content+=`
                <tr>
                <td>${tansactionsAmounts[i][0]}</td>
                <td>${tansactionsAmounts[i][2]}</td>
                <td>${tansactionsAmounts[i][1]}$</td>
                <td><button class="btn btn-primary" onclick="displayTransactionDetails('${i+1}')">Details</button></td>
            </tr>
            `
        }
    }
    $('#customers').html(content)
}