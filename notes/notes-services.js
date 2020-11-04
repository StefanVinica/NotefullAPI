const NoteService = {
getAllNotes(knex) {
    return knex.select('*').from('note')
},
insertNotes(knex,newNote){
    return knex
    .insert(newNote)
    .into('note')
    .returning('*')
    .then(rows =>{
        return rows[0]
    })
},
getById(knex,id){
    return knex
    .from('note')
    .select('*')
    .where('id',id)
    .first()
},
deleteNote(knex,id){
    return knex('note')
    .where({id})
    .delete()
},
updateNote(knex,id,newNote){
    return knex('note')
    .where({id})
    .update(newNote)
},
}
module.exports = NoteService