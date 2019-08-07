const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', async (req, res) => {
 try {
  //  const query = db.select('posts')
  //  console.log(query)
  const posts = await db('posts'); // in knex short form
  //  const posts = await db.select('*').from('posts') // same as above code
  res.status(200).json(posts);
 } catch (err) {
  res.status(500).json({ message: 'error getting posts' });
 }
});

router.get('/:id', async (req, res) => {
 const { id } = req.params;

 try {
  //   const [post] = await db
  //    .select('*')
  //    .from('posts')
  //    .where({ id }); // .where('id', '=', id)
  const post = await db('posts')
   .where({ id })
   .first();
  if (post) {
   res.status(200).json(post);
  } else {
   res.status(404).json({ message: 'could not find post with this id ' });
  }
 } catch (err) {
  res.status(500).json({ message: 'failed to get a post', err });
 }
});

router.post('/', async (req, res) => {
 const postData = req.body;
 try {
  const post = await db('posts').insert(postData);
  res.status(201).json(post);
 } catch (err) {
  // missing body req
  res.status(500).json({ message: 'could not add your post' });
 }
});

router.put('/:id', async (req, res) => {
 const { id } = req.params;
 const postData = req.body;
 try {
  const count = await db('posts')
   .where('id', '=', id)
   .update(postData);
  if (count) {
   res.status(200).json({ updated: count });
  } else {
   // missing id in URI
   res.status(404).json({ message: 'could not found post with this id' });
  }
 } catch (err) {
  res.status(500).json({ message: 'could not update post', error: err });
 }
});

router.delete('/:id', async (req, res) => {
 const { id } = req.params;
 try {
  const count = await db('posts')
   .where({ id })
   //    .where('id', '=', id)
   .del();
  if (count) {
   res.status(202).json(count);
  } else {
   res.status(404).json({ message: 'Id is invalid' });
  }
 } catch (err) {
  res.status(500).json({ message: 'could not delete', error: err });
 }
});

module.exports = router;
