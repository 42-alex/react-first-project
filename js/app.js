var myNews = [
    {
        id: "1",
        author: "Mike Klein",
        text: "December 5, 2017 chess changed forever. Perhaps not only chess, but the whole world.",
        bigText: "A year ago AlphaGo program sensationally beat the world's strongest player in go, and now artificial intelligence " +
        "AlphaZero crushed the strongest rated chess engine. \n" +
        "Stockfish, which is used for home preparation by the majority of players, the winner of the TCEC 2016 Championship and " +
        "сhampionship Chess.com among computer programs in 2017, was clearly weaker. In a match of 100 parties, AlphaZero scored 28 wins with 72 draws and never lost.",
        comments: [
            {
                id: "1",
                text:  "AlphaGo Zero has not studied the history of chess for 1400 years. AlphaGo Zero model learns from scratch, playing solely with itself and " +
                "using random weights of a neural network as starting"
            },
            {
                id: "2",
                text:  "Yes, the lack of a debut book from Stockfish is in fact a serious problem."
            }
        ]
    },
    {
        id: "2",
        author: "Elon Musk",
        text: "I'm going to launch my own Tesla Roadster in space as part of the first test run of the SpaceX superheavy rocket",
        bigText: "On Friday, December 1, Elon Mask wrote in his \"Twitter\" that the new giant SpaceX rocket called Falcon Heavy " +
        "will start in January from the same NASA site, with which astronauts of Apollo 11 set out for the moon: Pad 39A in Cosmic " +
        "the center of Kennedy at Cape Canaveral, Florida.\n" +
        "As a useful load, I will use my cherry roadster Tesla, which will sound Space Oddity. The direction is the orbit of Mars. " +
        "It will stay in space for a billion years or so, if it does not explode on take-off"
    },
    {
        id: "3",
        author: "Vasiliy Lomachenko",
        text: "Rigondo was much weaker than me. He is strong in his weight class.",
        comments: [
            {
                id: "1",
                text: "Rigondeaux is a malingerer. The picture showed that there was no fracture or at least a crack."
            },
            {
                id: "2",
                text: "This is the fourth consecutive rival of Vasily, who refuses to continue the fight."
            }
        ]
    },
];

window.ee	=	new	EventEmitter();

var Comments = React.createClass({
    render: function () {
        var comments = this.props.comments;
        if(comments && comments.length > 0){
            var commentTemplate = comments.map(function (item) {
                return(
                    <li key={item.id}>
                        {item.text}
                    </li>
                )
            });
        } else {
            var commentTemplate = <li>No comments yet.</li>;
        }

        return(
            <div>{commentTemplate}</div>
        );
    }
});

var Article = React.createClass({
    propTypes:	{
        item:	React.PropTypes.shape({
            author:	React.PropTypes.string.isRequired,
            text:	React.PropTypes.string.isRequired,
        })
    },
    getInitialState: function () {
        return {
            bigTextVisible: false,
            commentsVisible: false,
        };
    },
    onReadMoreShowClick: function (e) {
        e.preventDefault();
        this.setState({bigTextVisible:	true});
    },
    onReadMoreHideClick: function (e) {
        e.preventDefault();
        this.setState({bigTextVisible:	false});
    },
    onShowCommClick: function (e){
        e.preventDefault();
        this.setState({commentsVisible: true});
    },
    onHideCommClick: function (e){
        e.preventDefault();
        this.setState({commentsVisible: false});
    },
    onDeleteClick: function (e) {
        window.ee.emit('News.delete.item', this.props.item.id);
    },
    onEditClick: function (e) {
        window.ee.emit('NewsForm.edit.item', this.props.item);
    },
    render: function () {

        return(
            <div className="article">
                <div className="article-body">
                    <p className="article-author">{this.props.item.author}</p>
                    <p className="article-text">{this.props.item.text}</p>
                    <a className={"article-link-readmore " + ((!this.state.bigTextVisible && this.props.item.bigText) ? "" : "none")} href="#" onClick={this.onReadMoreShowClick}>More</a>
                    <p className={"article-bigText " + ((this.state.bigTextVisible && this.props.item.bigText) ? "" : "none")}>{this.props.item.bigText}</p>
                    <a className={"article-link-hide " + (this.state.bigTextVisible ? "" : "none")} href="#" onClick={this.onReadMoreHideClick}>Hide</a>
                    <a className={"article-link-show-comm " + (this.state.commentsVisible ? "none" : "")} href="#" onClick={this.onShowCommClick}>Show comments</a>
                    <a className={"article-link-hide-hide-comm " + (this.state.commentsVisible ? "" : "none")} href="#" onClick={this.onHideCommClick}>Hide comments</a>
                    <span className="article-delete" title="Delete this news" onClick={this.onDeleteClick}>&nbsp;</span>
                    <span className="article-edit" title="Edit this news" onClick={this.onEditClick}>&nbsp;</span>
                </div>
                <div className={"article-comments " + (this.state.commentsVisible ? "" : "none")}>
                    <ol className="bullet">
                        <Comments comments={this.props.item.comments}/>
                    </ol>
                </div>
            </div>
        );
    }
});

var NewsForm = React.createClass({
    componentDidMount: function () {
        ReactDOM.findDOMNode(this.refs.authorInput).focus();
    },
    componentWillReceiveProps: function (nextProps) {
        ReactDOM.findDOMNode(this.refs.authorInput).value = nextProps.item.author || "";
        ReactDOM.findDOMNode(this.refs.textInput).value = nextProps.item.text || "";
        ReactDOM.findDOMNode(this.refs.bigTextInput).value = nextProps.item.bigText || "";
    },
    getInitialState: function () {
        return{
            isAgreeChecked: false
        };
    },
    onFormSubmit: function (e) {
        e.preventDefault();
        var item = [{
            id: this.props.item.id,
            author: ReactDOM.findDOMNode(this.refs.authorInput).value,
            text: ReactDOM.findDOMNode(this.refs.textInput).value,
            bigText: ReactDOM.findDOMNode(this.refs.bigTextInput).value
        }];
        if(!item[0].author){
            swal("Warning!", "Please, enter an author of the article!", "warning");
        } else if (!item[0].text){
            swal("Warning!", "Please, enter a text of the article!", "warning");
        }
        else {
            window.ee.emit('NewsForm.submit', item);
        }

        this.props.onCancelFormClick();
    },
    onCancelButtonClick: function (e) {
        e.preventDefault();
        this.props.onCancelFormClick();
    },
    onChangeCheckRule: function (e) {
        this.setState({isAgreeChecked: e.target.checked});
    },
    render: function () {
        return(
            <form className='add cf'>
                <input type="text" ref="authorInput" className="add__author" placeholder="Enter the author of the article" defaultValue={this.props.item.author || ""} />
                <input type="text" ref="textInput" className="add__text" placeholder="Enter the abridged text of the article" defaultValue={this.props.item.text || ""} />
                <textarea type="text" ref="bigTextInput" className="add__big_text" placeholder="Enter the full text of the article" defaultValue={this.props.item.bigText || ""} />
                <label	className='add__checkrule'>
                    <input	type='checkbox'	defaultChecked={this.state.isAgreeChecked}	ref='checkrule'	onChange={this.onChangeCheckRule} />I agree with the rules
                </label>
                <button ref="submitForm" className="add__btn" onClick={this.onFormSubmit} disabled={!this.state.isAgreeChecked}>{(this.props.item ? "Edit" : "Add")} news</button>
                <button ref="hideForm" className="cancel__btn" onClick={this.onCancelButtonClick}>Cancel</button>
            </form>
        );
    }
});

var News = React.createClass({
    componentDidMount: function () {
        var	self	=	this;

        window.ee.addListener('NewsForm.edit.item', function(item)	{
            self.setState({
                showForm: true,
                itemForEdit: item
            });
        });
    },
    componentWillUnmount: function () {
        window.ee.removeListener('NewsForm.edit.item', function(){});
    },
    propTypes:	{
        news:	React.PropTypes.array.isRequired
    },
    getInitialState: function () {
        return{
            showForm: false,
            itemForEdit: ''
        };
    },
    onAddButtonClick: function (e) {
        e.preventDefault();
        this.setState({
            showForm: true,
            itemForEdit: ''
        });
    },
    hideForm: function () {
        this.setState({showForm: false});
    },
    render: function(){
        var news = this.props.news;
        if(news.length > 0){
            var newsTemplate = news.map(function(item){
                return(
                    <div className="articleWrapper" key={item.id}>
                        <Article item={item}/>
                    </div>
                );
            });
        } else {
            var newsTemplate = <p>No news</p>;
        }

        return(
            <div className="news">
                {newsTemplate}
                {this.state.showForm ? <NewsForm item={this.state.itemForEdit} onCancelFormClick={this.hideForm} /> : ""}
                <a className={"add-button " + (this.state.showForm ? "none" : "")}  href="#" onClick={this.onAddButtonClick} >
                    <span className="add-icon">&nbsp;</span>
                    <span className="add-text">Add</span>
                </a>
                <strong className={"news__count " + (news.length ? '' : 'none')}>Total news: {news.length}</strong>
            </div>
        );
    }
});

var App = React.createClass({
    componentDidMount:	function()	{
        var	self	=	this;

        var localStorageNews = JSON.parse(localStorage.getItem('news'));
        if(localStorageNews){
            this.setState({news: localStorageNews});
        }

        window.ee.addListener('News.delete.item',	function(id)	{
            var arr = self.state.news;
            var indexToRemove = arr.findIndex(obj => obj.id == id);
            arr.splice(indexToRemove , 1);
            self.setState({news:	arr}, self._updateLocalStorage);
        });

        window.ee.addListener('NewsForm.submit',	function(item)	{
            var news = self.state.news;
            if(!item[0].id){
                var newId = 0;
                for(var i=0; i<news.length; i++){
                    if(news[i].id > newId){
                        newId = news[i].id;
                    }
                }
                item[0].id = parseInt(newId)+1;
                self.setState({news: item.concat(news)});
            } else {
                for(var i=0; i<news.length; i++){
                    if(news[i].id == item[0].id){
                        news[i].author = item[0].author;
                        news[i].text = item[0].text;
                        news[i].bigText = item[0].bigText;
                    }
                }
                self.setState({news: news});
            }
        });
    },
    componentDidUpdate: function () {
        this._updateLocalStorage();
    },
    componentWillUnmount: function () {
        window.ee.removeListener('News.delete.item', function(){});
        window.ee.removeListener('NewsForm.submit', function(){});
    },
    getInitialState: function () {
        return{
            news: myNews,
        };
    },
    onSearch: function (e) {
        var searchQuery = e.target.value.toLowerCase();
        var displayedContacts = myNews.filter(function(el) {
            var searchValue = el.author.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });

        this.setState({
            news: displayedContacts
        });
    },
    _updateLocalStorage: function () {
        var news = JSON.stringify(this.state.news);
        localStorage.setItem('news', news);
    },
    render: function(){
        return(
            <div className="app">
                <h1>News</h1>
                <input type="text" className="search__field" onChange={this.onSearch} placeholder="Search articles by author" />
                <News news={this.state.news}/>
            </div>
        );
    }
});

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);