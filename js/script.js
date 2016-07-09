/* global $ */
/* global _ */
$(()=>{
// Конструктор заметки
class Note{
	constructor(title, text, date, done = false){
		this.title = title;
		this.text = text;
		this.date = date;
		this.isDone = done;
	}
}
// Конструктор массива
class NotesArchive extends Array{
	renderNote(note){
		const template = $('#template').html();
		const compiled = _.template(template);
		const newElement = compiled(note);
		$('.notes-list').append(newElement);
	}
	saveArr(){
		localStorage.setItem('myNotes', JSON.stringify(this))
	}
	push(note){
		super.push(note);
		this.renderNote(note);
		this.saveArr();
	}
	noteIsDone(num, target){
		this[num].isDone = !this[num].isDone;
		$(target).attr('title', this[num].isDone ? 'Undone' : 'Done');
		this.saveArr();
	}
	removeNote(num){
		this.splice(num, 1);
		this.saveArr();
	}
	saveEdit(num, note, date){
		this[num].title = note.find('.note-title').text();
		this[num].text = note.find('.note-body').text();
		this[num].date = date;
		note.find('.note-title, .note-body').attr('contenteditable', false);
		this.saveArr();
	}
	deleteDoneNotes(){
		for (let i = this.length-1; i >= 0; i--){
			if(this[i].isDone){
				this.removeNote(i)
			}
		}
	}
	searchNotes(){
		$('.note').addClass('hide-el');
		if($('.search').val() === ''){
			$('.note').removeClass('hide-el')
		}
		$(this).each((i, el)=>{
			if(el.title === $('.search').val()){
				$($('.note')[i]).removeClass('hide-el')
			}
		})
	}
	overlapNote(note){
		let noteTitleVal = note ? $(note).find('h1').text() : $('.note-title').val();
		let noteBodyVal = note ? $(note).find('p').text() : $('.note-body').val();
		// Проверка полей ввода
		if (noteTitleVal.length > 0 && noteBodyVal.length > 0){
			// Проверка совпадения заметок
			for (let i = 0; i < this.length; i++) {
				if(this[i].title === noteTitleVal && this[i].text === noteBodyVal){
					if(!confirm('Такая заметка уже существует, все равно добавить?')) return false
					break
				}
			}
		} else{
			alert('Введите заголовок и текст заметки')
			return false
		}
		return true
	}
}
// Конструктор приложения
class toDoApp{
	constructor(){
		this.myNotes = new NotesArchive();
		if(localStorage.myNotes){
			$(JSON.parse(localStorage.myNotes)).each((i,item)=> {
				let note = new Note(item.title, item.text, item.date, item.isDone);
				this.myNotes.push(note);
			});
		}
		this.visibilityButton();
		this.eventsInit();
	}
	visibilityButton(){
		$('.delete-done').addClass('not-available');
		$(this.myNotes).each(i=>{
			if(this.myNotes[i].isDone){
				$('.delete-done').removeClass('not-available')
			}
		})
	}
	getDate(){
		let addZero = i => {
			if (i < 10) i = '0' + i;
			return i;
		};
		let dayNow = [new Date().getDate(),new Date().getMonth()+1,new Date().getFullYear()].join('-');
		let timeNow = [addZero(new Date().getHours()),addZero(new Date().getMinutes())].join(':');
		return dayNow + ' ' + timeNow
	}
	eventsInit(){
		// Добавление заметки
		$('.add').click(()=>{
			let note = new Note($('.note-title').val(), $('.note-body').val(), this.getDate());
			if(this.myNotes.overlapNote()){
				this.myNotes.push(note);
				this.visibilityButton();
				$('.note-title').val('');
				$('.note-body').val('');
			}
		});
		// Действия с заметками
		$('.notes-list').on('click', e=>{
			let note = $(e.target).closest('.note');
			let num = $(note).index();
			// Пометить, как выделенную / отменить
			if($(e.target).hasClass('done')){
				note.toggleClass('is-done');
				this.myNotes.noteIsDone(num, e.target);
				this.visibilityButton();
			}
			// Удалить заметку
			if($(e.target).hasClass('delete')){
				if(confirm('Подтвердите удаление')){
					note.remove();
					this.myNotes.removeNote(num);
					this.visibilityButton();
				}
			}
			// Редактирование заметки
			if($(e.target).hasClass('edit')){
				note.find('.note-title, .note-body').attr('contenteditable', true);
				note.addClass('edit-mod');
			}
			// Сохранение редактирования
			if($(e.target).hasClass('save')){
				if(this.myNotes.overlapNote(note)){
					note.removeClass('edit-mod');
					this.myNotes.saveEdit(num, note, this.getDate());
				}
			}
		});
		// Удалить все выполненные заметки
		$('.delete-done').click(()=>{
			if(!$('.delete-done').hasClass('not-available') && confirm('Подтвердите удаление')){
				this.myNotes.deleteDoneNotes();
				this.visibilityButton();
				$('.note.is-done').remove();
			}
		});
		// Показать поиск
		$('.open-search').click(()=>{
			$('.note-create').toggleClass('show-search')
		});
		// Поиск
		$('.search').keyup(()=>{
			this.myNotes.searchNotes()
		});
		// Показ/скрытие выполненных
		$('.hide-show').click(()=>{
			$('.notes-list').toggleClass('hide');
			$('.hide-show').toggleClass('fa-eye-slash fa-eye');
		});
		// Подняться на верх страницы
		$('.page-up').click(()=>{
			if($(window).scrollTop() > 0 && $('body').is(':not(:animated)')){
				$('body').animate({scrollTop: 0}, 1000);
			}
		});
		// Активация кнопки "наверх"
		$(window).scroll(()=>{
			if($(window).scrollTop() > 0){
				$('.page-up').removeClass('not-available')
			} else{
				$('.page-up').addClass('not-available')
			}
		});
	}
}

new toDoApp();
})