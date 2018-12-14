var express = require('express')
var app = express()


app.get('/', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New User',
		name: '',
		age: '',
		email: ''		
	})
})

// ADD NEW USER POST ACTION
app.post('/', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO users SET ?', user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('index', {
						
						name: user.name,
						age: user.age,
						email: user.email					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					req.getConnection(function(error, conn) {
                        conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
                    res.render('index', {title: 'My Node.js Application',name: '',
                    age: '',
                    email: '', data: rows	})
                
                })
                })
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        req.getConnection(function(error, conn) {
            conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
        res.render('index', {title: 'My Node.js Application',name: req.body.name,
        age: req.body.age,
        email: req.body.email, data: rows	})
        
        })
    })
    }
})



module.exports = app
