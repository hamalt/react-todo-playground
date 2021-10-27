// TODO: https://medium.com/free-code-camp/crud-operations-using-vanilla-javascript-cd6ee2feff67

class TodoData {
  id: string;
  title: string;
  done: boolean;
  date: Date;

  constructor(id: string, title: string, done: boolean, date: Date) {
    this.id = id;
    this.title = title;
    this.done = done;
    this.date = date;
  }
}

class Todo {
  // referencing this keyword
  self: Todo = this;

  list: HTMLElement | null;
  todoList: Array<TodoData>;

  li: HTMLElement;
  edit: HTMLElement;
  delete: HTMLElement;
  complete: HTMLElement;

  constructor() {
    this.list = document.querySelector<HTMLElement>(".list-items");
    this.todoList = new Array<TodoData>();

    this.li = document.createElement<'li'>('li');
    this.edit = document.createElement<'button'>('button');
    this.delete = document.createElement<'button'>('button');
    this.complete = document.createElement<'button'>('button');

    this.todoDataInit();
    this.render();

    // 新しい項目の追加用イベントリスナ
    let btnAddItem = document.querySelector('.btn-add-item');
    if (null !== btnAddItem) {
      btnAddItem.addEventListener('click', this.create.bind(this));
    }

    let btnUpdate = document.querySelector('.btn-update');
    if (null !== btnUpdate) {
      btnUpdate.addEventListener('click', this.update.bind(this));
    }

    // クリック時の処理
    document.addEventListener('click', event => {
      const { target } = event;
      if (!(target instanceof HTMLButtonElement)) {
        return; // or throw new TypeError();
      }

      // 削除ボタンクリック時
      if (target.classList.contains('btn-delete')) {
        this.remove(event);
      }

      // フォーム編集ボタンクリック時
      if (target.classList.contains('btn-edit')) {
        this.renderEditForm(event);
      }

      // タスク完了ボタンをクリック時
      if (target.classList.contains('btn-complete')) {
        this.setTaskComplete(event);
      }
    });
  }

  /**
   * モックデータの初期化処理
   */
  todoDataInit(): void {
    this.todoList.push(new TodoData('1', 'This is first title', false, new Date()));
    this.todoList.push(new TodoData('2', 'This is second title', false, new Date()));
    this.todoList.push(new TodoData('3', 'This is third title', false, new Date()));
    this.todoList.push(new TodoData('4', 'This is forth title', false, new Date()));
  }

  // レンダーされてるフォームの編集
  renderEditForm(event: Event): void {
    const { target } = event;
    if (!(target instanceof HTMLButtonElement)) {
      return; // or throw new TypeError();
    }

    let id = target.getAttribute('data-id');
    if (null === id) return;


    let editPopup = document.querySelector('.edit-popup');
    if (null !== editPopup) {
      editPopup.classList.remove('hide');
      editPopup.classList.add('show');
    }

    let btnUpdate = document.querySelector('.btn-update');
    if (null !== btnUpdate) {
      btnUpdate.setAttribute('data-id', id);
    }

    this.todoList.forEach(item => {
      if (item.id === id) {
        let editItem = document.querySelector<HTMLInputElement>('.edit-item');
        if (null !== editItem) {
          editItem.value = item.title;
        }
      }
    });
  }

  /**
   * TODOリストのデータレンダリング
   */
  render(): void {
    if (this.list !== null) {
      this.list.innerHTML = '';
    }

    this.todoList.find((item: TodoData) => {
      this.createDomElements(item.id);

      if (item.title !== undefined) {
        this.li.insertAdjacentHTML('afterbegin', item.title);
      } else {
        this.li.insertAdjacentHTML('afterbegin', "");
      }

      if (item.done) {
        this.li.classList.add('done');
      }

      if (this.list !== null) {
        this.list.appendChild(this.li);
      }
    });
  }

  /**
   * DOM要素の作成ステップ（CRUDのC!）
   * @param id
   */
  createDomElements(id: string): void {
    this.li = document.createElement<'li'>('li');
    this.edit = document.createElement<'button'>('button');
    this.delete = document.createElement<'button'>('button');
    this.complete = document.createElement<'button'>('button');

    this.edit.classList.add('btn-edit');
    this.delete.classList.add('btn-delete');
    this.complete.classList.add('btn-complete');

    this.delete.setAttribute('data-id', id);
    this.edit.setAttribute('data-id', id);
    this.complete.setAttribute('data-id', id);

    this.edit.innerHTML = 'Edit';
    this.delete.innerHTML = 'Delete';
    this.complete.innerHTML = 'Complete';

    this.li.appendChild(this.delete);
    this.li.appendChild(this.edit);
    this.li.appendChild(this.complete);
  }

  /**
   * 新しい項目を作成（作成されたDOM要素を元に）
   */
  create(): void {
    let todoItem = document.querySelector<HTMLInputElement>('.item');

    // 項目名が無い場合は作成しない
    if (!todoItem?.value) return;

    this.todoList.push(new TodoData(
      Date.now().toString(),
      todoItem.value,
      false,
      new Date()
    ));

    let item = document.querySelector<HTMLInputElement>('.item');
    if (item?.value) {
      item.value = '';
    }

    this.render();
  }

  /**
   * 項目の削除
   * @param event
   */
  remove(event: Event): void {
    // HTML Button Elementの継承関係では無いなら処理をしない
    const { target } = event;
    if (!(target instanceof HTMLButtonElement)) {
      return; // or throw new TypeError();
    }

    // IDの取得
    let id = target.getAttribute('data-id');

    // 残したい要素だけ返す（削除ボタンと同じIDだったら返さない）
    this.todoList = this.todoList.filter(item => {
      if (item.id !== id) {
        return item;
      }
    });

    this.render();
  }

  // 更新
  update(event: Event): void {
    // TODO: 値が更新されないので修正する
    const { target } = event;
    if (!(target instanceof HTMLButtonElement)) {
      return; // or throw new TypeError();
    }

    let id = target.getAttribute('data-id');

    let editItem = document.querySelector<HTMLInputElement>('.edit-item');
    if (null === editItem) return;

    let itemTobeUpdated = editItem.value;

    this.todoList = this.todoList.map(item => {
      if (item.id === id) {
        item['title'] = itemTobeUpdated;
      }

      return item;
    });

    let editPopup = document.querySelector('.edit-popup');
    if (null !== editPopup) {
      editPopup.classList.remove('show');
      editPopup.classList.add('hide');
    }

    this.render();
  }

  // step to set task as complete
  setTaskComplete(event: Event): void {
    let { target } = event;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    let id = target.getAttribute('data-id');

    this.todoList = this.todoList.filter(item => {
      if (item.id === id) {
        item['done'] = true;
      }

      return item;
    });

    this.render();
  }
}
export default Todo;
