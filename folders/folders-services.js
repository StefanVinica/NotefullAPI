const FolderService = {
getAllFolders(knex) {
    return knex.select('*').from('folders')
}
}
module.exports = FolderService