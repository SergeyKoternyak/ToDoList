import $ from 'jquery';

class ArrayProx {};
ArrayProx.prototype = Array.prototype;

export default class NotesArchive extends ArrayProx{
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