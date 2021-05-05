export default class TodoDb {
    constructor(db) {
      this.db = db;
    }
  
    createTasksTable() {
      return new Promise((resolve, reject) => {
        this.db.transaction((tx) => {
         
            tx.executeSql(
            `create table if not exists tasks (
              id integer primary key autoincrement,
              listId integer not null,
              description text not null,
              done boolean not null,
              dueDate integer
            
              )`,
              [],
              
              (tx, resultSet) => {
                resolve();
              },

              (tx, error) => {
                console.log("error create table")
                console.log(tx);
                console.log(error);
                reject(error);
              });

          }); 
        
      });
    }
  
    createListsTable() {
      console.log("TodoDb: createListsTable")
      return new Promise((resolve, reject) => {

        this.db.transaction((tx) => {
         
          tx.executeSql(
            `create table if not exists lists (
            id integer primary key autoincrement,
            name text not null,
            icon text not null,
            count integer default 0)`,
            [],
            (tx, resultSet) => {
              resolve();
            },
            (tx, error) => {
              console.log(error);
              reject(error);
            }
          );
        });
      });
    }
  
    ///////////
    // Task //
    /////////
  
    insertTask(listId, description, dueDate) {
      console.log("insert task")
      return new Promise((resolve, reject) => {
        if (!listId || !description) {
          reject("missing params");
        }
        this.db.transaction((tx) => {
          tx.executeSql(
            `insert into tasks (listId, description, dueDate, done) values (?, ?, ?, ?);`,
            [listId, description, dueDate, false],
            (tx, resultSet) => {
              console.log("BEFORE RESOLVE")

              let insertedId = resultSet.insertId;

              tx.executeSql(`update lists set count = count + 1 where id = ?`, [listId], (tx, resultSet)=>{
                resolve(insertedId);

              }, (tx, error)=>{
                console.log("insertTask " + error);
                reject(error);
              })

            },
            (tx, error) => {
              console.log(tx)
          
              console.log("insertTask " + error);
              reject(error);
            }
          );
        });
      });
    }
  
    getTask(id) {
      return new Promise((resolve, reject) => {
        if (!id) {
          reject("missing params");
        }
        this.db.transaction((tx) => {
          tx.executeSql(
            `select * from tasks where id = ?`,
            [id],
            (tx, resultSet) => {
              resolve(resultSet.rows.item(0));
            },
            (tx, error) => {
              console.log("getTask " + error);
              reject(error);
            }
          );
        });
      });
    }
  
    updateTask(id, description) {
      return new Promise((resolve, reject) => {
        if (!id || !description) {
          reject("missing params");
        }
        this.db.transaction((tx) => {
          tx.executeSql(
            `update tasks set description = ? where id = ?`,
            [description, id],
            (tx, resultSet) => {
              resolve(resultSet.rowsAffected);
            },
            (tx, error) => {
              console.log("deleteTask " + error);
              reject(error);
            }
          );
        });
      });
    }

    updateTaskDone(id, done) {
      return new Promise((resolve, reject) => {
        if (!id || done === undefined || done === null) {
          reject("missing params");
        }
        this.db.transaction((tx) => {
          tx.executeSql(
            `update tasks set done = ? where id = ?`,
            [done, id],
            (tx, resultSet) => {
              resolve(resultSet.rowsAffected);
            },
            (tx, error) => {
              console.log("updateTaskDone " + error);
              reject(error);
            }
          );
        });
      });
    }

    deleteTask(id) {
      return new Promise((resolve, reject) => {
        if (!id) {
          reject("missing params");
        }
        this.db.transaction((tx) => {
          tx.executeSql(
            `delete from tasks where id = ?`,
            [id],
            (tx, resultSet) => {
              resolve(resultSet.rowsAffected);
            },
            (tx, error) => {
              console.log("deleteTask " + error);
              reject(error);
            }
          );
        });
      });
    }

    deleteCompletedTasks(){ 
      console.log("todoDb")
      return new Promise((resolve, reject) => {
   
      this.db.transaction((tx) => {
        tx.executeSql(
          `delete from tasks where done = ?`,
          [1],
          (tx, resultSet) => {
            console.log(tx);
            resolve(resultSet.rowsAffected);
          },
          (tx, error) => {
            console.log("deleteTask " + error);
            reject(error);
          }
        );
      });
    });

    }
  
    ///////////
    // List //
    /////////
  
    insertList(name, icon) {
      return new Promise((resolve, reject) => {
        if (!name || !icon) {
          reject("missing params");
        }
        this.db.transaction((tx) => {
          tx.executeSql(
            `insert into lists (name, icon) values (?, ?);`,
            [name, icon],
            (tx, resultSet) => {
              resolve(resultSet.insertId);
            },
            (tx, error) => {
              console.log("insertList " + error);
              reject(error);
            }
          );
        });
      });
    }
  
    updateList({ id, name, icon }) {
      return new Promise((resolve, reject) => {
        if (!id || (!name && !icon)) {
          reject("missing params");
        }
  
        let query;
        let params;
        if (name) {
          if (icon) {
            query = `update lists set name = ?, icon = ? where id = ?;`;
            params = [name, icon, id];
          } else {
            query = `update lists set name = ? where id = ?;`;
            params = [name, id];
          }
        } else {
          query = `update lists set icon = ? where id = ?;`;
          params = [icon, id];
        }
  
        this.db.transaction((tx) => {
          tx.executeSql(
            query,
            params,
            (tx, resultSet) => {
              resolve(resultSet.rowsAffected);
            },
            (tx, error) => {
              console.log("insertList " + error);
              reject(error);
            }
          );
        });
      });
    }
  
    getList(id) {
      return new Promise((resolve, reject) => {
        if (!id) {
          reject("missing params");
        }
  
        this.db.transaction(async (tx) => {
          tx.executeSql(
            "select * from lists where id = ?",
            [id],
            (tx, resultSet) => {
              resolve(resultSet.rows.item(0));
            },
            (tx, error) => {
              console.log("getList " + error);
              reject(error);
            }
          );
        });
      });
    }
  
    getLists() {
      return new Promise((resolve, reject) => {
        this.db.transaction(async (tx) => {
          tx.executeSql(
            "select * from lists",
            [],
            (tx, resultSet) => {

              resolve(resultSet.rows.raw());
            },
            (tx, error) => {
              console.log("getList " + error);
              reject(error);
            }
          );
        });
      });
    }
  
    getTasksInList(listId) {
      return new Promise((resolve, reject) => {
        if (!listId) {
          reject();
        }
        this.db.transaction((tx) => {
          tx.executeSql(
            `select * from tasks where listId = ?`,
            [listId],
            (tx, resultSet) => {
              resolve(resultSet.rows.raw());
            },
            (tx, error) => {
              console.log("getTasks " + error);
              reject(error);
            }
          );
        });
      });
    }
  
    deleteList(id) {
      return new Promise((resolve, reject) => {
        if (!id) {
          reject("missing params");
        }
  
        this.db.transaction(async (tx) => {
          tx.executeSql(
            "delete from lists where id = ?",
            [id],
            async (tx, resultSet) => {
              try {
                var deletedTasks = await this._deleteTasksInList(id);
              } catch (error) {
                reject(error);
              }
              resolve({ deletedLists: resultSet.rowsAffected, deletedTasks });
            },
            (tx, error) => {
              console.log("getList " + error);
              reject(error);
            }
          );
        });
      });
    }
  
    _deleteTasksInList(listId) {
      return new Promise((resolve, reject) => {
        if (!listId) {
          reject();
        }
        this.db.transaction((tx) => {
          tx.executeSql(
            `delete from tasks where listId = ?`,
            [listId],
            (tx, resultSet) => {
              resolve(resultSet.rowsAffected);
            },
            (tx, error) => {
              console.log("_deleteTasksInList " + error);
              reject(error);
            }
          );
        });
      });
    }
  }
  