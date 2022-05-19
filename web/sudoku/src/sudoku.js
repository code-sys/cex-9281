class Sudoku
{
    constructor(difficulty = 'easy', position) {
        this.difficulty = difficulty;
        this.position = position;
        this.currentCell = -1;
        this.unusedNumbers = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Contiene la cantidad de veces que el número es usado

        switch (difficulty)
        {
            case 'easy':
                this.hideCells = 4;
                break;
            case 'normal':
                this.hideCells = 5;
                break;
            case 'hard':
                this.hideCells = 6;
                break;
            default:
                this.hideCells = 4;
        }

        this.cellsDOM = undefined;
        this.cellsToHide = []; // Contiene las posiciones de las celdas a ocultar (0 - 80)
        this.rowsWithCellsHide = undefined; // Usado para el DOM
        this.rows = this.createRows();
        this.squarePos = [
            {
                'row': {
                    'from': 0,
                    'to': 2
                },
                'cellRow': {
                    'from': 0,
                    'to': 2
                }
            },
            {
                'row': {
                    'from': 0,
                    'to': 2
                },
                'cellRow': {
                    'from': 3,
                    'to': 5
                }
            },
            {
                'row': {
                    'from': 0,
                    'to': 2
                },
                'cellRow': {
                    'from': 6,
                    'to': 8
                }
            },
            {
                'row': {
                    'from': 3,
                    'to': 5
                },
                'cellRow': {
                    'from': 0,
                    'to': 2
                }
            },
            {
                'row': {
                    'from': 3,
                    'to': 5
                },
                'cellRow': {
                    'from': 3,
                    'to': 5
                }
            },
            {
                'row': {
                    'from': 3,
                    'to': 5
                },
                'cellRow': {
                    'from': 6,
                    'to': 8
                }
            },
            {
                'row': {
                    'from': 6,
                    'to': 8
                },
                'cellRow': {
                    'from': 0,
                    'to': 2
                }
            },
            {
                'row': {
                    'from': 6,
                    'to': 8
                },
                'cellRow': {
                    'from': 3,
                    'to': 5
                }
            },
            {
                'row': {
                    'from': 6,
                    'to': 8
                },
                'cellRow': {
                    'from': 6,
                    'to': 8
                }
            },
        ];
    }

    create()
    {
        this.fillRows();

        if (!this.ok()) {
            this.create();
        } else {
            this.markCellsToHide();
            this.rowsWithCellsHide = this.copyRows(this.rows);
            this.paint(this.rows);
            console.table(this.rows); // ERROR eliminar
        }
    }

    markCellsToHide()
    {
        // TODO Además se debe indicar la cantidad de cuadros a aumentar de acuerdo a la dificultad
        let squarersToUpHideCells = this.computeSquarers(1); // TODO agregar de acuerdo a la dificultad
        let squarersToLowHideCells = this.computeSquarers(1, squarersToUpHideCells); // TODO agregar de acuerdo a la dificultad
        let squarers = [];
        let firstSquarerGroup = 0;
        let sudokuCell = -1; // Representa la celda actual de todo el sudoku

        // Marcando las celdas vacías con el valor 0
        for (let square = 1; square <= 9; ++square) {
            let cellHide = 1
            let cellsToHide = [];
            let sq = this.createSquare();
            sq = this.fillSquare(sq, square, this.rows);

            // TODO convertir en un método que devuelva el valor al crear la variable "cellHide"
            if (this.difficulty != 'easy' || square == 4 || square == 9)
                if (this.in(square, squarersToLowHideCells))
                    cellHide = 2;
                else if (this.in(square, squarersToUpHideCells))
                    cellHide = 0;

            for (cellHide; cellHide <= this.hideCells; ++cellHide) {
                let randomCell = this.getRandomIntInclusive(0, 8);

                if (this.in(randomCell, cellsToHide)) {
                    --cellHide;
                } else {
                    sq[this.getRow(randomCell)][this.getCellRow(randomCell)] = 0;
                    cellsToHide.push(randomCell);
                }
            }

            if (this.correctHiding(sq)) squarers.push(sq);
            else --square;
        }

        for (let squarerGroup = 0; squarerGroup <= 2; ++squarerGroup) { // Iterando de 3 en 3 cuadros
            firstSquarerGroup = squarerGroup * 3;

            for (let row = 0; row <= 2; ++row) { // Iterando en el row de cada uno de los tres cuadros
                for (let squarer = 0; squarer <= 2; ++squarer) { // Iterando en cada cuadro
                    let currentSquarer = firstSquarerGroup + squarer;
                    let cell1 = squarers[currentSquarer][row][0];
                    let cell2 = squarers[currentSquarer][row][1];
                    let cell3 = squarers[currentSquarer][row][2];

                    ++sudokuCell;
                    if (cell1 === 0) this.cellsToHide.push(sudokuCell);

                    ++sudokuCell;
                    if (cell2 === 0) this.cellsToHide.push(sudokuCell);

                    ++sudokuCell;
                    if (cell3 === 0) this.cellsToHide.push(sudokuCell);
                }
            }
        }
    }
    
    /**
     * Obtiene una lista aleatoria de cuadros del sudoku
     *
     * @param {int}     cuantity        Cantidad de cuadros a obtener
     * @param {array}   exclude         Cuadros a excluir
     * @param {int}     maxVerify       Cantidad de veces que se verificará si el cuadro aleatorio obtenido
     *                                  no se encuentra en la lista de los excluidos. 
     * @param {int}     maxIntents      Cantidad de veces que se verificará si el cuadro aleatorio obtenido
     *                                  no se encuentra en la lista de los ya agregados para retornar. 
     */
    computeSquarers(cuantity, exclude = [], maxVerify = 40, maxIntents = 60)
    {
        let squarers = [];

        for (let c = 1; c <= cuantity; ++c) {
            let randomSq = this.getRandomIntInclusive(1, 9);

            if (!this.in(randomSq, exclude))
                if (--maxIntents >= 0 && this.in(randomSq, squarers)) --c;
                else squarers.push(randomSq);
            else if (--maxVerify >= 0) --c;
        }

        return squarers;
    }

    // TODO las combinaciones deben pasarse como parámetros
    correctHiding(sq)
    {
        /**
         * Combinaciones de Celdas visibles (1 - 9) que no deben darse
         * para interpretarlo como una ocultación correcta de celdas.
         */
        let combinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 3, 4],
            [1, 2, 4, 5],
            [3, 4, 6, 7],
            [4, 5, 7, 8]
        ];
        let visibleCells = [];
        let currentCell = -1;
        let correctHiding = true;

        for(let row = 0; row <= 2; ++row) {
            for (let cellRow = 0; cellRow <= 2; ++cellRow) {
                let value = sq[row][cellRow];
                ++currentCell;
                if (value !== 0) visibleCells.push(currentCell);
            }
        }

        for (let idxC = 0; idxC < combinations.length; ++idxC) {
            let combination = combinations[idxC];

            if (this.arrayIn(combination, visibleCells)) {
                correctHiding = false;
                break;
            }
        }

        return correctHiding;
    }

    /**
     * Obtiene la fila de un numero dado en el rango 0 - 8 para un cuadrado de 9 x 9
     */
    getRow(n)
    {
        if (n <= 2) return 0;
        else if (n <= 5) return 1;
        else if (n <= 8) return 2;
        else return 0;
    }

    /**
     * Obtiene la celda de la fila de un numero dado en el rango 0 - 8 para un cuadrado de 9 x 9
     */
    getCellRow(n)
    {
        if (this.in(n, [0, 3, 6])) return 0;
        else if (this.in(n, [1, 4, 7])) return 1;
        else if (this.in(n, [2, 5, 8])) return 2;
        else return 0;
    }

    in(n, values)
    {
        let exists = false;

        for (let idx = 0; idx < values.length; ++idx) {
            if (n === values[idx]) {
                exists = true;
                break;
            }
        }

        return exists;
    }

    arrayIn(arr, values)
    {
        let coincidencies = 0;

        for (let idx = 0; idx < values.length; ++idx) {
            let value = values[idx];

            for (let arrIndx = 0; arrIndx < arr.length; ++arrIndx) {
                let arrValue = arr[arrIndx];

                if (arrValue === value) {
                    ++coincidencies;
                    break;
                }
            }
        }

        return coincidencies === arr.length;
    }

    /**
     * Crea un cuadrado de 9 x 9
     */
    createSquare()
    {
        return [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
    }

    /**
     * Llena del cuadro de 9 x 9
     */
    fillSquare(square, squareNumber, rows)
    {
        let squarePos = this.squarePos[squareNumber - 1];
        let currentSquareRow = -1;

        for (let row = squarePos.row.from; row <= squarePos.row.to; ++row) {
            let currentRow = rows[row];
            let currentSquareCellRow = -1;
            ++currentSquareRow;

            for (let cellRow = squarePos.cellRow.from; cellRow <= squarePos.cellRow.to; ++cellRow) {
                let currentCellValue = currentRow[cellRow];
                square[currentSquareRow][++currentSquareCellRow] = currentCellValue;
            }
        }

        return square;
    }

    paint(rows)
    {
        let wrapper = document.createElement('div');
        let sudokuElement = document.createElement('div');

        wrapper.classList.add('w-sudoku');
        sudokuElement.classList.add('sudoku');

        rows.forEach((row, idx) => {
            sudokuElement.appendChild(this.createElementRow(row, idx))
        });

        wrapper.appendChild(sudokuElement);
        wrapper.appendChild(this.createControls());
        this.position.appendChild(wrapper);
        this.cellsDOM = this.position.getElementsByClassName('cell');
    }

    createElementRow(row, rowIdx)
    {
        let elementRow = document.createElement('div');
        elementRow.classList.add('row');
        elementRow.dataset.rowIdx = rowIdx;

        row.forEach((cell, idx) => {
            elementRow.appendChild(this.createElementCell(rowIdx, idx, cell));
        })

        return elementRow;
    }

    // TODO aplicar refactorin
    createElementCell(rowIdx, cellIdx, cellValue)
    {
        let elementCell = document.createElement('div');
        let contentCellNumber = this.createContentCellNumber(rowIdx, cellIdx, cellValue);
        let contentPosibilityNumbers = this.createContentPosibilityNumbers();
        elementCell.dataset.cellIdx = cellIdx;
        elementCell.dataset.cellValue = cellValue;
        elementCell.appendChild(contentCellNumber[0]);
        elementCell.appendChild(contentPosibilityNumbers);
        elementCell.classList.add('cell');

        if (!contentCellNumber[1]) {
            elementCell.classList.add('no-interactive');
        }

        elementCell.addEventListener('drop', function(e) {
            if (this.cellIsInteractive(e.target)) {
                // Asignando el posible número que puede ir en la celda
                if (e.dataTransfer.getData('posibility-number')) {
                    let wpn = e.target.querySelector('.w-posibility-numbers');
                    let posibilityNumber = e.dataTransfer.getData('posibility-number');
                    let arrNumbers = wpn.dataset.numbers.split(' ').sort();

                    if (!this.in(posibilityNumber, arrNumbers) )  {
                        wpn.dataset.numbers = wpn.dataset.numbers + ' ' + posibilityNumber;
                    }
                } else {
                    let currentRow = parseInt(e.target.parentNode.dataset.rowIdx);
                    let cellRow = parseInt(e.target.dataset.cellIdx);

                    // Mostrando el número que debe ir en la celda
                    if (e.dataTransfer.getData('available')) {
                        let available = parseInt(e.dataTransfer.getData('available'));
                        
                        if (available > 0) {
                            let btnShowNumber = document.getElementById('btn-show-number');
                            let contentElement = e.target.querySelector('div');
                            let currentNumber = contentElement.textContent;
                            let number = parseInt(e.target.dataset.cellValue);
                            let wPn = e.target.querySelector('.w-posibility-numbers');
                            
                            btnShowNumber.dataset.available = --available;
                            if (available == 0) btnShowNumber.classList.add('disabled');
    
                            this.addUnusedNumber(number);
                            this.rowsWithCellsHide[currentRow][cellRow] = number;
                            
                            contentElement.textContent = number;
                            contentElement.dataset.interactive = 'false';
    
                            e.target.classList.remove('bad', 'ok');
                            e.target.classList.add('revealing');
                            
                            if (currentNumber !== '')
                                this.substractUnusedNumber(currentNumber);

                            // Quitando la lista de posibles números
                            if (wPn) wPn.dataset.numbers = '';
                        }
                    }
                    // Asignando el número indicado por el usuario
                    else {
                        let currentNumber = e.target.querySelector('div').textContent;
                        let number = e.dataTransfer.getData('number');
    
                        if (currentNumber != number) {
                            if (this.unusedNumbers[number - 1] < 9) {
                                this.addUnusedNumber(number);
                                this.substractUnusedNumber(currentNumber);
                                e.target.querySelector('div').textContent = number;
    
                                let topCellRepeatValue = this.topCellRepeatValue(this.rowsWithCellsHide, currentRow, cellRow, parseInt(number));
                                let bottomCellRepeatValue = this.bottomCellRepeatValue(this.rowsWithCellsHide, currentRow, cellRow, parseInt(number));
                                let leftCellRepeatValue = this.leftCellRepeatValue(this.rowsWithCellsHide, currentRow, cellRow, parseInt(number));
                                let rightCellRepeatValue = this.rightCellRepeatValue(this.rowsWithCellsHide, currentRow, cellRow, parseInt(number));
                                let repeatValueInSquare = this.repeatValueInSquare((this.getSquarePos(currentRow, cellRow)).idx, parseInt(number));
        
                                this.rowsWithCellsHide[currentRow][cellRow] = parseInt(number);
                                
                                if (
                                    topCellRepeatValue ||
                                    bottomCellRepeatValue ||
                                    leftCellRepeatValue ||
                                    rightCellRepeatValue ||
                                    repeatValueInSquare
                                ) {
                                    e.target.classList.add('bad');
                                } else {
                                    e.target.classList.add('ok');
                                }
                            }
                        }
                    }
                }
            }
        }.bind(this));

        elementCell.addEventListener('dragover', function(e) {
            e.preventDefault();
            return false;
        });

        elementCell.addEventListener('dblclick', function(e) {
            if (this.cellIsInteractive(e.target)) {
                let currentRow = parseInt(e.target.parentNode.dataset.rowIdx);
                let cellRow = parseInt(e.target.dataset.cellIdx);
                let currentNumber = e.target.querySelector('div').textContent;
                this.substractUnusedNumber(currentNumber);
                e.target.classList.remove('ok', 'bad');
                e.target.querySelector('div').textContent = '';
                this.rowsWithCellsHide[currentRow][cellRow] = undefined;
            }
        }.bind(this));

        elementCell.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            if (this.cellIsInteractive(e.target)) {
                let wPn = e.target.querySelector('.w-posibility-numbers');
                let posibilityNumbers = wPn.dataset.numbers.trim();
                let arrPosibilityNumbers = posibilityNumbers != '' ? posibilityNumbers.split(' ').sort() : [];

                if (arrPosibilityNumbers.length > 0) {
                    let posibilityNumbersEditor = this.createPosibilityNumbersEditor(arrPosibilityNumbers);
                    let currentPosibilityNumbersEditor = e.target.querySelector('.posibility-numbers-editor');

                    if (currentPosibilityNumbersEditor)
                        currentPosibilityNumbersEditor.remove();

                    e.target.appendChild(posibilityNumbersEditor);
                }
            }
        }.bind(this));

        return elementCell;
    }

    getLightingCells()
    {
        let lightingCells = [];

        for (let idx = 0; idx < this.cellsDOM.length; ++idx) {
            let cd = this.cellsDOM[idx];

            if (cd != undefined && cd.classList.contains('lighting')) {
                lightingCells.push(cd);
            }
        }

        return lightingCells;
    }

    createContentPosibilityNumbers()
    {
        let w = document.createElement('div');
        w.classList.add('w-posibility-numbers');
        w.dataset.numbers = '';

        setInterval(() => {
            let numbers = w.dataset.numbers;

            if (numbers != undefined) {
                let arrNumbers = numbers.split(' ').sort();
                let strNumbers = '';

                arrNumbers.forEach(n => {
                    strNumbers += n + ' ';
                });

                w.textContent = strNumbers.trim();
            }
        }, 200);

        return w;
    }

    createContentCellNumber(rowIdx, cellIdx, cellValue)
    {
        let contentCellNumber = document.createElement('div');
        let interactive = true;

        if (!this.in(++this.currentCell, this.cellsToHide)) {
            contentCellNumber.textContent = cellValue;
            this.unusedNumbers[cellValue - 1] = this.unusedNumbers[cellValue - 1] + 1;
            interactive = false;
        } else {
            // Quitamos el número que no será mostrado en la interfaz
            this.rowsWithCellsHide[rowIdx][cellIdx] = undefined;
        }

        contentCellNumber.dataset.interactive = interactive;
        return [contentCellNumber, interactive];
    }

    createPosibilityNumbersEditor(numbers)
    {
        let pne = document.createElement('div');
        pne.classList.add('posibility-numbers-editor');
        pne.addEventListener('contextmenu', (e) => {
            e.stopPropagation();
            e.preventDefault();
            pne.remove();
        });
        numbers.forEach(n => {
            let btn = document.createElement('button');
            btn.textContent = n;
            btn.classList.add('btn-delete-posibility-number');
            btn.addEventListener('click', () => {
                let currentNumberToRemove = btn.textContent;
                let wpn = pne.parentNode
                    .querySelector('.w-posibility-numbers');
                let numbers = wpn.dataset
                    .numbers
                    .split(' ')
                    .sort();
                let strNumbers = '';
                let buttons = pne.getElementsByTagName('button');

                numbers.forEach(n => {
                    if (n != currentNumberToRemove)
                        strNumbers += n + ' ';
                });

                wpn.dataset.numbers = strNumbers;

                if (buttons.length == 1)
                    pne.remove();

                btn.remove();
            });
            pne.appendChild(btn);
        });
        return pne;
    }

    createControls()
    {
        let controls = document.createElement('div');
        let cgBtnNumbers = this.createControlGroup('cg-btn-numbers');
        let cgBtnPosibilityNumbers = this.createControlGroup('cg-btn-posibility-numbers');
        
        controls.classList.add('controls');
        controls.appendChild(this.createBtnShowNumber());

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(n => {
            cgBtnNumbers.appendChild(this.createBtnNumber(n));
        });

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(n => {
            cgBtnPosibilityNumbers.appendChild(this.createBtnPosibilityNumber(n));
        });

        controls.appendChild(cgBtnNumbers);
        controls.appendChild(cgBtnPosibilityNumbers);
        return controls;
    }

    createBtnShowNumber()
    {
        let btnShowNumber = document.createElement('button');
        btnShowNumber.setAttribute('id', 'btn-show-number');
        btnShowNumber.setAttribute('draggable', true);
        btnShowNumber.dataset.available = '3';
        btnShowNumber.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('available', btnShowNumber.dataset.available);
        });
        btnShowNumber.addEventListener('dragend', function(e) {

        });

        setInterval(() => {
            let available = btnShowNumber.dataset.available;
            btnShowNumber.textContent = 'Mostrar número (intentos restantes ' + available + ')';
        }, 200);

        return btnShowNumber;
    }

    createBtnPosibilityNumber(n)
    {
        let btnWrapper = document.createElement('div');
        let btnNumber = document.createElement('button');

        btnWrapper.classList.add('w-btn-posibility-number-to-add');

        btnNumber.setAttribute('id', 'btn-p-n-' + n);
        btnNumber.classList.add('btn-posibility-number-to-add');
        btnNumber.textContent = n;
        btnNumber.setAttribute('draggable', true);
        btnNumber.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('posibility-number', this.textContent);
        });
        btnNumber.addEventListener('dragend', function(e) {
            // Some code...
        });

        btnWrapper.appendChild(btnNumber);

        return btnWrapper;
    }

    createBtnNumber(n)
    {
        let btnWrapper = document.createElement('div');
        let btnNumber = document.createElement('button');

        btnWrapper.classList.add('w-btn-number-to-add');

        btnNumber.setAttribute('id', 'btn-n-' + n);
        btnNumber.classList.add('btn-number-to-add');
        btnNumber.textContent = n;
        btnNumber.setAttribute('draggable', true);
        btnNumber.addEventListener('dragstart', function(e) {
            let number = e.target.textContent;
            e.dataTransfer.setData('number', number);
            this.toLight(number);
            this.lightingCells();
        }.bind(this));
        btnNumber.addEventListener('dragend', function(e) {
            this.toTurnOff();
            this.toTurnOffCells();
        }.bind(this));

        btnWrapper.appendChild(btnNumber);
        btnWrapper.appendChild(this.createCounterAvailableNumbers(n));

        return btnWrapper;
    }

    createCounterAvailableNumbers(n)
    {
        let c = document.createElement('div');
        c.classList.add('counter-available-number');

        setInterval(() => {
            let availableNumbers = 9 - this.unusedNumbers[n - 1];
            c.textContent = availableNumbers;
            c.classList.remove('available', 'no-available');

            if (availableNumbers == 0) {
                c.classList.add('no-available');
                c.previousElementSibling.classList.add('disabled');
            } else {
                c.previousElementSibling.classList.remove('disabled');
                c.classList.add('available');
            }
        }, 200);

        return c;
    }

    createControlGroup(id) {
        let controlGroup = document.createElement('div');
        controlGroup.setAttribute('id', id);
        return controlGroup;
    }

    // Ilumina las celdas que tienen el número especificado
    toLight(number)
    {
        for (let idx = 0; idx <= this.cellsDOM.length; ++idx) {
            const cd = this.cellsDOM[idx];

            // if (cd != undefined && !cd.classList.contains('no-interactive')) {
            if (cd != undefined) {
                const div = cd.querySelector('div:first-child');
                const currentNumber = div.textContent;
                if (currentNumber == number) cd.classList.add('lighting');
            }
        }
    }

    toTurnOff()
    {
        for (let idx = 0; idx <= this.cellsDOM.length; ++idx) {
            const cd = this.cellsDOM[idx];
            if (cd != undefined)
                cd.classList.remove('lighting');
        }
    }

    lightingCells()
    {
        const cellsToLigthing = this.getLightingCells();

        cellsToLigthing.forEach(ctl => {
            const row = parseInt(ctl.parentNode.dataset.rowIdx) + 1;
            const cell = parseInt(ctl.dataset.cellIdx) + 1;
            const topCellsDOM = this.topCellsDOM(this.cellsDOM, row, cell);
            const bottomCellsDOM = this.bottomCellsDOM(this.cellsDOM, row, cell);
            const leftCellsDOM = this.leftCellsDOM(this.cellsDOM, row, cell);
            const rightCellsDOM = this.rightCellsDOM(this.cellsDOM, row, cell);

            [
                topCellsDOM,
                bottomCellsDOM,
                leftCellsDOM,
                rightCellsDOM,
            ].forEach(cellsDOM => {
                cellsDOM.forEach(cellDOM => {
                    if (!cellDOM.classList.contains('lighting'))
                        cellDOM.classList.add('lighting-line');
                });
            });
        });
    }

    toTurnOffCells()
    {
        for (let idx = 0; idx < this.cellsDOM.length; ++idx) {
            const cellDOM = this.cellsDOM[idx];
            if (cellDOM != undefined)
                cellDOM.classList.remove('lighting-line');
        }
    }

    cellIsInteractive(cellNode)
    {
        let isInteractive = cellNode.querySelector('div').dataset.interactive;
        return this.stringToBoolean(isInteractive);
    }

    stringToBoolean(string)
    {
        return string === 'true' ? true : false;
    }

    // Verifica si se han llenado todas las celdas de cada columna
    ok()
    {
        let undefinedLength = 0;

        this.rows.forEach(row => {
            row.forEach(cell => {
                if (cell === undefined) ++undefinedLength;
            });
        });

        return undefinedLength == 0 ? true : false;
    }

    createRows()
    {
        let rows = [];
        for (let length = 0; length < 9; ++length)
            rows.push([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]);
        return rows;
    }

    fillRows()
    {
        this.rows.forEach((row, idx) => {
            row = this.fillRow(idx);
        });
    }

    fillRow(currentRow)
    {
        let maxForCellRow = 90; // Asignar valor -1 para desactivar
        let auxMaxForCellRow = maxForCellRow;
        let maxForRow = 30; // Asignar valor -1 para desactivar
        let undefinedLength = 0;

        for (let cellRow = 0; cellRow < 9; ++cellRow) {
            let availableNumbers = this.getAvailableNumbers(currentRow, cellRow);
            let nIdx = this.getRandomIntInclusive(1, availableNumbers.length) - 1;
            let number = availableNumbers[nIdx];
            let topCellRepeatValue = this.topCellRepeatValue(this.rows, currentRow, cellRow, number);
            let leftCellRepeatValue = this.leftCellRepeatValue(this.rows, currentRow, cellRow, number);

            if (!topCellRepeatValue && !leftCellRepeatValue) {
                // availableNumbers|numbers.splice(nIdx, 1);
                this.rows[currentRow][cellRow] = number;
                auxMaxForCellRow = maxForCellRow;
            } else {
                if (--auxMaxForCellRow >= 0) --cellRow;
                else ++undefinedLength;
            }

            if (cellRow == 8 && undefinedLength > 0) {
                if (--maxForRow >= 0) {
                    // availableNumbers|numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    auxMaxForCellRow = maxForCellRow;
                    cellRow = -1; // Obtiene el valor cero al sumarle 1 en el bucle for
                    undefinedLength = 0;
                    this.clearRow(currentRow);
                }
            }
        }
    }

    getAvailableNumbers(currentRow, cellRow)
    {
        let squarePos = this.getSquarePos(currentRow, cellRow);
        let rowFrom = squarePos.row.from,
            rowTo = currentRow - 1,
            cellsRow = this.createArrayWithRange(squarePos.cellRow.from, squarePos.cellRow.to);
        let currentNumbersAssigned = this.allPrevRowsValues(rowFrom, rowTo, cellsRow);
        let availableNumbers = [];

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(n => {
            let coincidencies = 0;

            currentNumbersAssigned.forEach(cna => {
                if (n === cna) ++coincidencies;
            });

            if (coincidencies === 0) availableNumbers.push(n);
        });

        return availableNumbers;
    }

    createArrayWithRange(from, to)
    {
        let array = [];
        for (let value = from; value <= to; ++value)
            array.push(value);
        return array;
    }

    /**
     * Obtiene los valores de las celdas indicadas para las "filas anteriores".
     */
    allPrevRowsValues(from, to, cellsRow)
    {
        let prevValues = [];

        for (let row = to; row >= from; --row) {
            let currentRow = this.row(row);

            cellsRow.forEach(idx => {
                prevValues.push(currentRow[idx]);
            });
        }

        return prevValues;
    }

    getSquarePos(row, cellRow)
    {
        let currentSq = {};

        for (let idx = 0; idx < this.squarePos.length; ++idx) {
            let sp = this.squarePos[idx];
            let rowRange = [row, sp.row.from, sp.row.to];
            let cellRowRange = [cellRow, sp.cellRow.from, sp.cellRow.to];

            if (this.squareRangeIsValid(rowRange, cellRowRange)) {
                currentSq.idx = idx + 1;
                currentSq.row = sp.row;
                currentSq.cellRow = sp.cellRow;
                break;
            }
        }

        return currentSq;
    }

    squareRangeIsValid(r1, r2)
    {
        if (
            this.between(r1[0], [r1[1], r1[2]]) &&
            this.between(r2[0], [r2[1], r2[2]])
        ) {
            return true;
        }

        return false;
    }

    between(value, arrValues)
    {
        if (value >= arrValues[0] && value <= arrValues[1]) return true;
        return false;
    }

    clearRow(row)
    {
        this.rows[row].forEach((cell, idx) => this.rows[row][idx] = undefined);
    }

    /**
     * Verifica si se repite el número pasado en uno de los 9
     * cuadros que forman el sudoku.
     */
    repeatValueInSquare(square, number)
    {
        let existsValue = false;
        let sq = this.createSquare();
        sq = this.fillSquare(sq, square, this.rowsWithCellsHide);

        for (let idxRow = 0; idxRow < sq.length; ++idxRow) {
            if (this.in(number, sq[idxRow])) {
                existsValue = true;
                break;
            }
        };

        return existsValue;
    }

    topCellRepeatValue(rows, currentRow, currentCell, value)
    {
        let repeatValue = false;

        for (let cr = currentRow; cr >= 0; --cr) {
            let prevTopCellValue = this.prevTopCellValue(rows, cr, currentCell);

            if (prevTopCellValue === value) {
                repeatValue = true;
                break;
            }
        }

        return repeatValue;
    }

    bottomCellRepeatValue(rows, currentRow, currentCell, value)
    {
        let repeatValue = false;

        for (let cr = 9; cr > currentRow; --cr) {
            let prevTopCellValue = this.prevTopCellValue(rows, cr, currentCell);

            if (prevTopCellValue === value) {
                repeatValue = true;
                break;
            }
        }

        return repeatValue;
    }

    leftCellRepeatValue(rows, currentRow, currentCell, value)
    {
        let repeatValue = false;

        for (let cc = currentCell; cc >= 0; --cc) {
            let prevLeftCellValue = this.prevLeftCellValue(rows, currentRow, cc);

            if (prevLeftCellValue === value) {
                repeatValue = true;
                break;
            }
        }

        return repeatValue;
    }

    rightCellRepeatValue(rows, currentRow, currentCell, value)
    {
        let repeatValue = false;

        for (let cc = 9; cc > currentCell; --cc) {
            let prevLeftCellValue = this.prevLeftCellValue(rows, currentRow, cc);

            if (prevLeftCellValue === value) {
                repeatValue = true;
                break;
            }
        }

        return repeatValue;
    }

    topCellsDOM(cellsDOM, row, cell)
    {
        let topCellsDOM = [];

        for (let r = row; r > 0; --r) {
            const range = this.getRangeIdxCellDOM(r);
            const cellDOM = cellsDOM[range.firstCellRow + cell - 1]; // restar -1 permite encontrar la ubicación exacta en el array
            topCellsDOM.push(cellDOM);
        }

        return topCellsDOM;
    }

    bottomCellsDOM(cellsDOM, row, cell)
    {
        let bottomCellsDOM = [];

        for (let r = row; r <= 9; ++r) {
            const range = this.getRangeIdxCellDOM(r);
            const cellDOM = cellsDOM[range.firstCellRow + cell - 1]; // restar -1 permite encontrar la ubicación exacta en el array
            bottomCellsDOM.push(cellDOM);
        }

        return bottomCellsDOM;
    }

    leftCellsDOM(cellsDOM, row, cell)
    {
        let leftCellsDOM = [];
        const range = this.getRangeIdxCellDOM(row);
        const currentCell = range.firstCellRow + cell - 1;

        // restar -1 permite encontrar la ubicación exacta en el array
        for (let c = currentCell; c >= range.firstCellRow; --c) {
            const cellDOM = cellsDOM[c];
            leftCellsDOM.push(cellDOM);
        }

        return leftCellsDOM;
    }

    rightCellsDOM(cellsDOM, row, cell)
    {
        let rightCellsDOM = [];
        const range = this.getRangeIdxCellDOM(row);
        const currentCell = range.firstCellRow + cell - 1;

        // restar -1 permite encontrar la ubicación exacta en el array
        for (let c = currentCell; c <= range.lastCellRow; ++c) {
            const cellDOM = cellsDOM[c];
            rightCellsDOM.push(cellDOM);
        }

        return rightCellsDOM;
    }

    getRangeIdxCellDOM(currentRow)
    {
        let lastCellRow = currentRow * 9 - 1;
        let firstCellRow = lastCellRow - 8;

        return {
            'firstCellRow': firstCellRow,
            'lastCellRow': lastCellRow,
        };
    }

    getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    row(row) {
        return row >= 0 ? this.rows[row] : null;
    }

    prevRow(rows, currentRow) {
        return currentRow > 0 ? rows[currentRow - 1] : null;
    }

    prevTopCellValue(rows, currentRow, currentCell)
    {
        let row = this.prevRow(rows, currentRow);
        return row === null ? null : row[currentCell];
    }

    prevLeftCellValue(rows, currentRow, currentCell)
    {
        if (currentCell == 0) return null;
        return rows[currentRow][currentCell - 1];
    }

    addUnusedNumber(number)
    {
        this.unusedNumbers[number - 1] = this.unusedNumbers[number - 1] + 1;
    }

    substractUnusedNumber(number)
    {
        if (number !== '')
            this.unusedNumbers[number - 1] = this.unusedNumbers[number - 1] - 1;
    }

    copyRows(rows)
    {
        let arr = [];

        rows.forEach(row => {
            let auxRow = [];

            row.forEach(cell => {
                auxRow.push(cell);
            })

            arr.push(auxRow);
        })

        return arr;
    }
}