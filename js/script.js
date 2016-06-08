$(()=>{
// Конструктор заметки
class Note{
	constructor(title, text, date){
		this.title = title;
		this.text = text;
		this.date = date;
		this.isDone = false;
	}
}
// Конструктор массива
class NotesArchive extends Array{
	constructor(){
		super();
		if(localStorage.myNotes){
			$(JSON.parse(localStorage.myNotes)).each((i,item)=> this.push(item));
		}
	};
	renderNote(note){
		const template = $('#template').html();
		const compiled = _.template(template);
		const newElement = compiled(note);
		$('.output').append(newElement);
	}
	saveArr(){
		localStorage.setItem('myNotes', JSON.stringify(this));
	}
	push(note){
		super.push(note);
		this.renderNote(note);
		this.saveArr();
	}
	noteIsDone(num, target){
		this[num].isDone = !this[num].isDone;
		$(target).text(this[num].isDone ? 'Undone' : 'Done');
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
		$(note).find('.date').text(this[num].date);
	}
	deleteDoneNotes(){
		for (let i = this.length-1; i >= 0; i--){
			if(this[i].isDone){
				this.removeNote(i)
			}
		}
	}
	deleteAllNotes(){
		for (let i = this.length-1; i >= 0; i--){
			this.removeNote(i)
		}
	}
	searchNotes(){
		$($('li')).each((i, el)=>{
			$(el).addClass('hide-search');
			if($('.search').val() === ''){
				$(el).removeClass('hide-search');
			}
		});
		$(this).each((i, el)=>{
			if(el.title === $('.search').val()){
				$($('li')[i]).removeClass('hide-search');
			}
		});
	}
	overlapNote(note){
		let noteTitleVal = note ? $(note).find('h1').text() : $('.note-title').val();
		let noteBodyVal = note ? $(note).find('p').text() : $('.note-body').val();

		for (let i = 0; i < this.length; i++) {
			if(this[i].title === noteTitleVal && this[i].text === noteBodyVal){
				if(!confirm('Такая заметка уже существует, все равно добавить?')) return false
				break
			}
		};
		return true
	}
}

// Конструктор приложения
class toDoApp{
	constructor(){
		this.myNotes = new NotesArchive();

		this.visibilityButtons();
		this.eventsInit();
	};
	visibilityButtons(){
		$('.delete-all, .delete-done').addClass('not-available');
		$('.hide-show').addClass('hide-button');

		$(this.myNotes).each((i, el)=>{
			if(this.myNotes.length>0){
				$('.delete-all').removeClass('not-available');
			}
			if(this.myNotes[i].isDone){
				$('.delete-done').removeClass('not-available');
				$('.hide-show').removeClass('hide-button');
			}
		})
	}
	getDate(){
		let addZero = i => {
			if (i < 10) i = '0' + i;
			return i;
		};
		let dayNow = [new Date().getDate(),new Date().getMonth()+1,new Date().getFullYear()].join('/');
		let timeNow = [addZero(new Date().getHours()),addZero(new Date().getMinutes())].join(':');
		return dayNow + ' ' + timeNow
	};
	eventsInit(){
		// Добавление заметки
		$('.add').click(()=>{
			let title = $('.note-title').val();
			let text = $('.note-body').val();
			let note = new Note(title, text, this.getDate());
			if(this.myNotes.overlapNote()){
				this.myNotes.push(note);
				this.visibilityButtons();
			}
		});
		// Действия с заметками
		$('.output').on('click', e=>{
			let note = $(e.target).closest('.second-note');
			let num = $(note).index();
			// Пометить, как выделенную / отменить
			if($(e.target).hasClass('done')){
				note.toggleClass('ready');
				this.myNotes.noteIsDone(num, e.target);
				this.visibilityButtons();
			}
			// Удалить заметку
			if($(e.target).hasClass('delete')){
				if(confirm('Подтвердите удаление')){
					note.remove();
					this.myNotes.removeNote(num);
					this.visibilityButtons();
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
					this.myNotes.saveEdit(num, note, this.getDate())
				}
			}
		});
		// Удалить все выполненные заметки
		$('.delete-done').click(()=>{
			if(!$('.delete-done').hasClass('not-available') && confirm('Подтвердите удаление')){
				this.myNotes.deleteDoneNotes();
				this.visibilityButtons();
				$('.note-style.ready').remove();
			}
		})
		// Удалить все заметки
		$('.delete-all').click(()=>{
			if(!$('.delete-all').hasClass('not-available') && confirm('Подтвердите удаление')){
				this.myNotes.deleteAllNotes();
				this.visibilityButtons();
				$('.second-note').remove();
			}
		})
		// Поиск
		$('.search').keyup(()=>{
			this.myNotes.searchNotes();
		})
		// Показ/скрытие выполненных
		$('.hide-show').click(()=>{
			$('.output').toggleClass('hide');
			$('.hide-show').text($('.output').hasClass('hide') ? 'Show done' : 'Hide done');
		});
	}
}

new toDoApp();

});