use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use thiserror::Error;
use warp::{reject, Filter, Rejection, Reply};

#[derive(Error, Debug)]
enum Error {
    #[error("Unable to acquire mutex lock")]
    MutexError,

    #[error("DB error")]
    DbError,
}

impl reject::Reject for Error {}

#[derive(Debug, Serialize, Deserialize)]
struct Entry {
    id: i32,
    created_at: NaiveDateTime,
    name: String,
}

impl Entry {
    fn read_all(conn: &rusqlite::Connection) -> rusqlite::Result<Vec<Entry>> {
        let mut statement = conn.prepare("select id, created_at, name from entries;")?;
        let entries = statement
            .query_map([], |row| Entry::from_row(&row))?
            .collect();
        entries
    }

    fn from_row(row: &rusqlite::Row) -> std::result::Result<Entry, rusqlite::Error> {
        let id: i32 = row.get(0)?;
        let created_at_str: String = row.get(1)?;
        let name: String = row.get(2)?;

        let created_at = match NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S") {
            Ok(date) => Ok(date.into()),
            Err(err) => Err(rusqlite::Error::FromSqlConversionFailure(
                1,
                rusqlite::types::Type::Text,
                Box::new(err),
            )),
        }?;

        Ok(Entry {
            id,
            created_at,
            name,
        })
    }
}

fn handle_post(shared_conn: Arc<Mutex<rusqlite::Connection>>) -> Result<impl Reply, Rejection> {
    let conn = shared_conn
        .lock()
        .map_err(|_| reject::custom(Error::MutexError))?;
    conn.execute("insert into entries (name) values ('Nino');", ())
        .map_err(|_| reject::custom(Error::DbError))?;
    Ok("ok")
}

fn handle_list(shared_conn: Arc<Mutex<rusqlite::Connection>>) -> Result<impl Reply, Rejection> {
    let conn = shared_conn
        .lock()
        .map_err(|_| reject::custom(Error::MutexError))?;
    let entries = Entry::read_all(&conn).map_err(|_| reject::custom(Error::DbError))?;
    Ok(warp::reply::json(&entries))
}

#[tokio::main]
async fn main() {
    let conn = rusqlite::Connection::open("db.sql").expect("Unable to open DB");
    let shared_conn = Arc::new(Mutex::new(conn));
    let shared_data = warp::any().map(move || shared_conn.clone());

    let endpoints = {
        warp::path!("api" / "post")
            .and(warp::post())
            .and(shared_data.clone())
            .and_then(|shared_conn| async move { handle_post(shared_conn) })
    }
    .or({
        warp::path!("api" / "list")
            .and(shared_data.clone())
            .and_then(|shared_conn| async move { handle_list(shared_conn) })
    });

    warp::serve(endpoints).run(([127, 0, 0, 1], 3030)).await;
}
