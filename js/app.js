import $ from 'jquery';
import lodash from 'lodash';
import toDoApp from './toDoApp.js';
import '../styles/reset.css';
import '../node_modules/font-awesome/css/font-awesome.css';
import '../styles/style.less';

$(()=>{
	new toDoApp();
})