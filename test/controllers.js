'use strict';

var async = require('async');
var	assert = require('assert');
var nconf = require('nconf');
var request = require('request');

var db = require('./mocks/databasemock');
var categories = require('../src/categories');
var topics = require('../src/topics');
var user = require('../src/user');
var meta = require('../src/meta');


describe('Controllers', function () {

	var tid;
	var cid;

	before(function (done) {
		async.series({
			category: function (next) {
				categories.create({
					name: 'Test Category',
					description: 'Test category created by testing script'
				}, next);
			},
			user: function (next) {
				user.create({username: 'foo', password: 'barbar'}, next);
			}
		}, function (err, results) {
			if (err) {
				return done(err);
			}
			cid = results.category.cid;

			topics.post({uid: results.user, title: 'test topic title', content: 'test topic content', cid: results.category.cid}, function (err, result) {
				tid = result.topicData.tid;
				done(err);
			});
		});
	});

	it('should load default home route', function (done) {
		request(nconf.get('url'), function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load unread as home route', function (done) {
		meta.config.homePageRoute = 'unread';
		request(nconf.get('url'), function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load recent as home route', function (done) {
		meta.config.homePageRoute = 'recent';
		request(nconf.get('url'), function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load popular as home route', function (done) {
		meta.config.homePageRoute = 'popular';
		request(nconf.get('url'), function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load category as home route', function (done) {
		meta.config.homePageRoute = 'category/1/test-category';
		request(nconf.get('url'), function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load /reset without code', function (done) {
		request(nconf.get('url') + '/reset', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load /reset with invalid code', function (done) {
		request(nconf.get('url') + '/reset/123123', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load /login', function (done) {
		request(nconf.get('url') + '/login', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load /register', function (done) {
		request(nconf.get('url') + '/register', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load /robots.txt', function (done) {
		request(nconf.get('url') + '/robots.txt', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load /manifest.json', function (done) {
		request(nconf.get('url') + '/manifest.json', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load /outgoing?url=<url>', function (done) {
		request(nconf.get('url') + '/outgoing?url=http//youtube.com', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should 404 on /outgoing with no url', function (done) {
		request(nconf.get('url') + '/outgoing', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 404);
			assert(body);
			done();
		});
	});

	it('should load /tos', function (done) {
		meta.config.termsOfUse = 'please accept our tos';
		request(nconf.get('url') + '/tos', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});


	it('should load 404 if meta.config.termsOfUse is empty', function (done) {
		meta.config.termsOfUse = '';
		request(nconf.get('url') + '/tos', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 404);
			assert(body);
			done();
		});
	});

	it('should load /sping', function (done) {
		request(nconf.get('url') + '/sping', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert.equal(body, 'healthy');
			done();
		});
	});

	it('should load /ping', function (done) {
		request(nconf.get('url') + '/ping', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert.equal(body, '200');
			done();
		});
	});

	it('should handle 404', function (done) {
		request(nconf.get('url') + '/arouteinthevoid', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 404);
			assert(body);
			done();
		});
	});

	it('should load topic rss feed', function (done) {
		request(nconf.get('url') + '/topic/' + tid + '.rss', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load category rss feed', function (done) {
		request(nconf.get('url') + '/category/' + cid + '.rss', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load recent rss feed', function (done) {
		request(nconf.get('url') + '/recent.rss', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load popular rss feed', function (done) {
		request(nconf.get('url') + '/popular.rss', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load popular rss feed with term', function (done) {
		request(nconf.get('url') + '/popular/day.rss', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load recent posts rss feed', function (done) {
		request(nconf.get('url') + '/recentposts.rss', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load category recent posts rss feed', function (done) {
		request(nconf.get('url') + '/category/' + cid + '/recentposts.rss', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	it('should load user topics rss feed', function (done) {
		request(nconf.get('url') + '/user/foo/topics.rss', function (err, res, body) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert(body);
			done();
		});
	});

	after(function (done) {
		db.emptydb(done);
	});
});