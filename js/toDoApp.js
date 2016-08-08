import $ from 'jquery';
import Note from './Note.js';
import NotesArchive from './NotesArchive.js';

export default class toDoApp{
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