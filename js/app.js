//controller
const modeCtrl = (function () {

    class Item {
        constructor(id, task) {
            this.id = id;
            this.task = task;
        }
    }
    //data structure
    const mydata = {
        items: [{
                id: 0,
                task: 'Mycie okien'
            },
            {
                id: 1,
                task: 'sprzątanie pokoju'
            },
            {
                id: 2,
                task: 'wycieranie podłogi'
            }
        ],
        actualItem: null

    };
    //public methods
    return {
        getItem: function () {
            return mydata.items;
        },
        addItem: function (task) {
            let param;
            if (mydata.items.length > 0) {
                param = mydata.items[mydata.items.length - 1].id + 1;
            } else {
                param = 0;
            }
            // Create new item
            const newItem = new Item(param, task);

            mydata.items.push(newItem);

            return newItem;
        },
        elementbyId: function (id) {
            let select = null;
            mydata.items.forEach(function (item) {
                if (item.id === id) {
                    select = item;
                }
            });
            return select;
        },
        updateItem: function (task) {
            let found = null;

            mydata.items.forEach(function (item) {
                if (item.id === mydata.actualItem.id) {
                    item.task = task;
                    found = item;
                }
            });
            return found;
        },

        setActualItem: function (item) {
            mydata.actualItem = item;
        },
        getActualItem: function () {
            return mydata.actualItem;
        },

        logdata: function () {
            return mydata;
        }
    }

})();

const UInterface = (function () {

    const mySelectors = {
        listItem: '#ulCont li'
    }
    // public methods
    return {

        embedList: function (items) {
            let newTask = '';
            items.forEach(Task => {
                newTask += ` <li class="list col-12 mb-2" id="item-${Task.id}" >
             ${Task.task}<a class="close">
                x</a>
                <a class="edit-item far fa-edit"></a>
                 </li>`
            });
            document.getElementById('ulCont').innerHTML = newTask;

        },
        getInputValue: function () {
            return {
                task: document.querySelector('#myTask').value
            }
        },

        addItemToInput: function () {
            document.querySelector('#myTask').value = modeCtrl.getActualItem().task;
            UInterface.showEditState();
        },
        addItemList: function (item) {
            const li = document.createElement("li");

            li.className = "list col-12 mb-2";

            li.id = `item-${item.id}`;

            li.innerHTML = `${item.task}<a class="close">
            x</a>
            <a class="edit-item far fa-edit"></a>
             </li>`;
            document.querySelector("#ulCont").insertAdjacentElement('beforeend', li);
        },
        updatedItemList: function (item) {
            let listItemLi = document.querySelectorAll(mySelectors.listItem);
            //change node list into array
            listItems = Array.from(listItemLi);

            listItems.forEach(function (listItem) {
                const itemId = listItem.getAttribute('id');

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `${item.task}<a class="close">
                    x</a>
                    <a class="edit-item far fa-edit"></a>`
                }
            });
        },
        clear() {
            document.querySelector('#myTask').value = '';
        },
        clearEditState() {
            UInterface.clear();
            document.querySelector('.addButton').style.display = 'inline';
            document.querySelector('.update').style.display = 'none';
        },
        showEditState() {
            document.querySelector('.addButton').style.display = 'none';
            document.querySelector('.update').style.display = 'inline';
        }

    }
})();

const myApp = (function (modeCtrl, UInterface) {

    myListeners = function () {

        document.querySelector('#addBtn').addEventListener('click', addSubmit);

        document.querySelector('#ulCont').addEventListener('click', updateIcone);

        document.querySelector('#ulCont').addEventListener('click', deleteItem);

        document.querySelector('.update').addEventListener('click', apdateItem);

    };

    const deleteItem = function (e) {
        if (e.target.className === 'close') {
            e.target.parentElement.remove();
        }

        e.preventDefault();
    }

    const addSubmit = function (e) {
        const input = UInterface.getInputValue();

        if (input.task !== '') {
            const newItem = modeCtrl.addItem(input.task);

            UInterface.addItemList(newItem);
            //clear fields 
            UInterface.clear();
        }

        e.preventDefault();
    }
    //update icon   
    const updateIcone = function (e) {
        if (e.target.classList.contains('edit-item')) {
            const listParam = e.target.parentNode.id;

            const arrParam = listParam.split('-');

            const param = parseInt(arrParam[1]);

            const itemEdit = modeCtrl.elementbyId(param);

            modeCtrl.setActualItem(itemEdit);

            UInterface.addItemToInput();

        }
    }
    // add Item submit
    const apdateItem = function (e) {
        const input = UInterface.getInputValue();

        const updeteItem = modeCtrl.updateItem(input.task);

        UInterface.updatedItemList(updeteItem);

        UInterface.clearEditState();
        e.preventDefault();
    }
//Public methods
    return {
        start: function () {
            console.log('aplication is working');

            UInterface.clearEditState();

            items = modeCtrl.getItem();

            UInterface.embedList(items);
            myListeners();
        }
    }
})(modeCtrl, UInterface);
//start app
myApp.start();