export default class Note{
	constructor(title, text, date, done = false){
		this.title = title;
		this.text = text;
		this.date = date;
		this.isDone = done;
	}
}