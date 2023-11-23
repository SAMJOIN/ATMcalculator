let cellsCount = 1

function addCell() {
    if (cellsCount == 8) return;
    document.getElementById('cells').insertAdjacentHTML('beforeend', `<div class="cell" id="cell">
    <span class="state">
        <select class="nominal" >
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="2000">2000</option>
            <option value="5000">5000</option>
        </select>
        <input type="number" min="0" oninput="validity.valid||(value='');" class="count" value="0">
        <label class="switch">
            <input type="checkbox" checked>
            <span class="slider round"></span>
        </label>
    </span>
</div>`)
    cellsCount++;
}
function deleteCell() {
    if (cellsCount == 1) return;
    const cell = document.getElementById('cell');
    cell.parentNode.removeChild(cell);
    cellsCount--;
}
function calc() {
    let cellsObj = []
    let total = Number(document.getElementById('total').value);
    const cells = document.getElementsByClassName('cell'); // Все ячейки в HTMLcollections
    // Вытаскиваем номинал и количество из ячеек и помещаем в массив cellsObj
    for (let i = 0; i < cells.length; i++) {
        let mode = cells[i].children[0].children[2].children[0].checked; // Рабочая/нерабочая кассета
        if (!mode) { // Если рабочая
            let nominal = Number(cells[i].children[0].children[0].value); // Берём номинал
            let count = Number((cells[i]).children[0].children[1].value); // Берём количество
            if (count != 0 && total >= nominal) // Если сумма меньше номинала кассеты, то не будем включать её в массив
                cellsObj.push({ id: i, nominal, count })
        }
    }

    let inStock = cellsObj.reduce((inStock, current) => inStock + current.nominal * current.count, 0); // Имеющаяся сумма
    // Если суммы в банкомате достаточно и если в ней нет десяток и единиц, то просчитываем сколько надо выдать и откуда иначе ошибка
    if (total % 100 == 0 && inStock >= total && total > 0) {
        const start = new Date().getTime();
        // Сортируем по номиналу от высокого к низкому
        cellsObj.sort((a, b) => {
            if (a.nominal > b.nominal)
                return -1;
            if (a.nominal < b.nominal)
                return 1;
            return 0
        })
        let usedCells = []; // Инициализируем массив, в котором будем хранить используемые ячейки (id, usedCount)
        cellsObj.forEach((cell) => {
            if (total != 0) {
                usedCells.push({ id: cell.id, usedCount: 0 });
                while ((total >= cell.nominal) && cell.count > 0) {
                    total = total - cell.nominal;
                    cell.count--;
                    usedCells[usedCells.length - 1].usedCount++;
                }
            }
        })
        // Если вдруг автомат не смог выдать сумму
        if (total == 0) {
            const end = new Date().getTime();
            console.log(usedCells);
            result = usedCells.filter((cell) => cell.usedCount > 0); // Убираем неиспользуемые касеты
            console.log(result)
            result.sort((a,b) => { // Сортируем по id, чтобы было красиво
                if (a.id > b.id)
                return 1;
            if (a.id < b.id)
                return -1;
            return 0
            })

            let outputData = '';
            result.forEach((cell) => outputData += `${cell.usedCount} купюр из кассеты №${cell.id+1} \n`);

            alert(`Успех: \n ${outputData} Затраченное время на вычисление: ${end - start}ms`)
        }
        else {
            alert('Ошибка: автомат не может выдать требуемую сумму')
        }
    }
    else {
        alert('Ошибка: автомат не может выдать требуемую сумму')
    }
}