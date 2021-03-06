const strs = require('stringstream');

function tagsQueryString(tags, itemid, result) {
  const length = tags.length;
  return length === 0
    ? `${result};`
    : tags.shift() &&
        tagsQueryString(
          tags,
          itemid,
          `${result}($${tags.length + 1}, ${itemid})${length === 1 ? '' : ','}`
        );
}

module.exports = (postgres) => {
  return {
    //Later
    async createUser({ username, email, password }) {
      const newUserInsert = {
        text: 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', // @TODO: Authentication - Server 
        values: [username, email, password]
      };
      try {
        const user = await postgres.query(newUserInsert);
        return user.rows[0];
      } catch (e) {
        switch (true) {
          case /users_fullname_key/.test(e.message):
            throw 'An account with this username already exists.';
          case /users_email_key/.test(e.message):
            throw 'An account with this email already exists.';
          default:
            throw new Error(e);
        }
      }
    },
    //Later
    async getUserAndPasswordForVerification(email) {
      const findUserQuery = {
        text: 'SELECT * FROM users WHERE email = $1', // @TODO: Authentication - Server
        values: [email]
      };
        const user = await postgres.query(findUserQuery);
        if (!user) throw 'User was not found.';
        return user.rows[0];
     },
    async getUserById(id) {
      const findUserQuery = {
        text: 'SELECT * FROM users WHERE id = $1', // @TODO: Basic queries
        values: [id]
      };

      const user = await postgres.query(findUserQuery);
      return user.rows[0];
    },
    async getItems(idToOmit) {
      const items = await postgres.query({
        text:'SELECT * FROM items WHERE id!=$1',
        values: idToOmit ? [idToOmit] : [0]
      });
      return items.rows;
    },
    async getItemsForUser(id) {
      const items = await postgres.query({
        text: 'SELECT * FROM items WHERE ownerid =$1',
        values: [id]
      });
      return items.rows;
    },
    async getBorrowedItemsForUser(id) {
      const items = await postgres.query({
        text: 'SELECT * FROM items WHERE borrowerid = $1',
        values: [id]
      });
      return items.rows;
    },
    async getTags() {
      const tags = await postgres.query('SELECT * FROM tags');
      console.log(tags);
      return tags.rows;

    },
    async getTagsForItem(id) {
      const tagsQuery = {
        text: 'SELECT * FROM items_tags LEFT JOIN tags ON items_tags.tag_id=tags.id WHERE item_id=$1',
        values: [id]
      };

      const tags = await postgres.query(tagsQuery);
      console.log(tags);
      return tags.rows;
    },
    

    async saveNewItem({
      title,
      description,
      ownerID,
      borrowerID,
      tagIDs,
    }) {
      const client = await postgres.connect()
      try {
        // Begin postgres transaction
        console.log('beginning');
        await client.query('BEGIN')

        // Insert new Item
        const itemResult = await client.query({
          text: 'INSERT INTO items (title, description, ownerid, borrowerid) VALUES ($1, $2, $3, $4) RETURNING *',
          values: [title, description, ownerID, borrowerID]
        })
        const newItemId = itemResult.rows[0].id;
        console.log(itemResult);
        
        // Insert tags
        tagIDs = tagIDs.map(tagid => {return client.query({
          text: 'INSERT INTO items_tags (item_id, tag_id) VALUES ($1, $2)',
           values: [ newItemId, tagid]
        })})

        await Promise.all(tagIDs)
        // Commit the entire transaction!
        
        await client.query('COMMIT')

        return itemResult.rows[0]
      } catch (e) {
        // Something went wrong
        client.query('ROLLBACK', err => {
          if (err) {
            throw err;
          }
          // release the client back to the pool
        });
        throw e;
      }
    },



    //return
    async resetBorrowerIDforReturnItem(id) {
      const items = await postgres.query({
        text: 'UPDATE items SET borrowerid=null WHERE id=$1 RETURNING *',
        values: [id]
      });
      return items.rows;
    },

    //borrow
      async setBorrowerIDforItem({itemID, borrowerID}) {
        // itemid = {    
        //     itemID: 2
        //     borrowerID: 3
        //     ownerID: 3
        //   }
        console.log('The Item ID is: ', itemID);
        console.log('The borrower ID is: ', borrowerID);
      const items = await postgres.query({
        text: 'UPDATE items SET borrowerid=$2 WHERE id=$1 AND borrowerid IS NULL RETURNING *',
        values: [itemID,borrowerID]
      });

      console.log('items result ', items)

      if (items.rows.length === 0) {
        //alert('Item has been borrowed')
      }
      // if (error) {
      //   //alert('There is an error setting borrower ID for item')
      // }
      return items.rows[0];
    }
    
    
  }
}

