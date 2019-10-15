'use strict'

const connectDB = require('./db')
const { ObjectID } = require('mongodb')
const errorHandler = require('./errorHandler')

module.exports = {
  createCourse: async (root, { input }) => {
    const defaults = {
      teacher: '',
      topic: ''
    }
    const newCourse = Object.assign(defaults, input)
    let db
    let course

    try {
      db = await connectDB()
      course = await db.collection('Courses').insertOne(newCourse)
      newCourse._id = course.insertedId
    } catch(error) {
      errorHandler(error)
    }
    return newCourse
  },

  createPerson: async (root, { input }) => {
    let db
    let student

    try {
      db = await connectDB()
      student = await db.collection('Students').insertOne(input)
      student._id = student.insertedId
    } catch(error) {
      errorHandler(error)
    }
    return input
  },

  editCourse: async (root, { _id, input }) => {
    let db
    let course
    try {
      db = await connectDB()
      await db.collection('Courses').updateOne(
        { _id: ObjectID(_id) },
        { $set: input }
      )
      course = await db.collection('Courses').findOne({_id: ObjectID(_id)})
    } catch(error) {
      errorHandler(error)
    }
    return course
  },

  editPerson: async (root, { _id, input }) => {
    let db
    let student
    try {
      db = await connectDB()
      await db.collection('Students').updateOne(
        { _id: ObjectID(_id) },
        { $set: input }
      )
      student = await db.collection('Students').findOne({_id: ObjectID(_id)})
    } catch(error) {
      errorHandler(error)
    }
    return student
  },

  deleteCourse: async (root, { _id }) => {
    let db
    let course
    try {
      db = await connectDB()
      await db.collection('Courses').remove({ _id: ObjectID(_id) })
      course = await db.collection('Courses').findOne({_id: ObjectID(_id)})
    } catch(error) {
      errorHandler(error)
    }
    return course
  },

  deletePerson: async (root, { _id }) => {
    let db
    let student
    try {
      db = await connectDB()
      await db.collection('Students').remove({ _id: ObjectID(_id) })
      student = await db.collection('Students').findOne({_id: ObjectID(_id)})
    } catch(error) {
      errorHandler(error)
    }
    return student
  },

  addPeople: async (root, { courseID, personID }) => {
    let db
    let course
    let person
    try {
      db = await connectDB()
      person = await db.collection('Students').findOne({ _id: ObjectID(personID) })
      course = await db.collection('Courses').findOne({_id: ObjectID(courseID)})

      if(!course || !person) throw new Error ('La persona o el curso no existen')

      await db.collection('Courses').updateOne(
        { _id: ObjectID(courseID) },
        { $addToSet: { people: ObjectID(personID) } }
      )
    } catch(error) {
      errorHandler(error)
    }
    return course
  }
}
