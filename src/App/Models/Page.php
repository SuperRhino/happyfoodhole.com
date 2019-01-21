<?php
namespace App\Models;

use Core\Database\Model;

class Page extends Model {

    var $id;
    var $title;
    var $uri;
    var $article;
    var $preview_image;
    var $category;
    var $meta_title;
    var $meta_description;
    var $meta_keywords;
    var $author_id;
    var $post_date;
    var $updated_date;
    var $status;

    var $readingTime = null;

    function __construct($values = [])
    {
        $this->id = (int) array_get($values, 'id');
        $this->title = array_get($values, 'title');
        $this->uri = array_get($values, 'uri');
        $this->article = array_get($values, 'article');
        $this->preview_image = array_get($values, 'preview_image');
        $this->category = array_get($values, 'category');
        $this->meta_title = array_get($values, 'meta_title');
        $this->meta_description = array_get($values, 'meta_description');
        $this->meta_keywords = array_get($values, 'meta_keywords');
        $this->author_id = (int) array_get($values, 'author_id');
        $this->post_date = array_get($values, 'post_date') ?: date('Y-m-d H:i:s');
        $this->updated_date = array_get($values, 'updated_date');
        $this->status = array_get($values, 'status') ? 1 : 0;
    }

    public function updateData($values = [])
    {
        if (isset($values['title'])) {
            $this->title = array_get($values, 'title');
        }
        if (isset($values['uri'])) {
            $this->uri = array_get($values, 'uri');
        }
        if (isset($values['article'])) {
            $this->article = array_get($values, 'article');
        }
        if (isset($values['preview_image'])) {
            $this->preview_image = array_get($values, 'preview_image');
        }
        if (isset($values['category'])) {
            $this->category = array_get($values, 'category');
        }
        if (isset($values['meta_title'])) {
            $this->meta_title = array_get($values, 'meta_title');
        }
        if (isset($values['meta_description'])) {
            $this->meta_description = array_get($values, 'meta_description');
        }
        if (isset($values['meta_keywords'])) {
            $this->meta_keywords = array_get($values, 'meta_keywords');
        }
        if (isset($values['author_id'])) {
            $this->author_id = (int) array_get($values, 'author_id');
        }
        if (isset($values['post_date'])) {
            $this->post_date = array_get($values, 'post_date');
        }
        if (isset($values['status'])) {
            $this->status = array_get($values, 'status') ? 1 : 0;
        }
    }

    public function save()
    {
        if (! $this->id) {
            $this->createPage();
        } else {
            $this->updatePage();
        }
    }

    protected function createPage()
    {
        $article = str_ireplace('<img ', '<img class="img-responsive" ', $this->article);

        $insert = static::$app->query->newInsert();
        $insert->into('pages')
               ->cols([
                   'title' => $this->title,
                   'uri' => $this->uri,
                   'article' => $article,
                   'preview_image' => $this->cleanPagePreview(),
                   'category' => $this->category,
                   'meta_title' => $this->meta_title,
                   'meta_description' => $this->meta_description,
                   'meta_keywords' => $this->meta_keywords,
                   'author_id' => $this->author_id,
                   'post_date' => $this->post_date,
                   'status' => $this->status,
               ]);

        // prepare the statement + execute with bound values
        $sth = static::$app->db->prepare($insert->getStatement());
        $sth->execute($insert->getBindValues());

        $this->id = static::$app->db->lastInsertId();

        return $this->id;
    }

    protected function updatePage()
    {
        $update = static::$app->query->newUpdate();
        $update->table('pages')
               ->cols([
                   'title' => $this->title,
                   'uri' => $this->uri,
                   'article' => $this->article,
                   'preview_image' => $this->cleanPagePreview(),
                   'category' => $this->category,
                   'meta_title' => $this->meta_title,
                   'meta_description' => $this->meta_description,
                   'meta_keywords' => $this->meta_keywords,
                   'author_id' => $this->author_id,
                   'post_date' => $this->post_date,
                   'status' => $this->status,
               ])
               ->where('id = ?', $this->id);

        // prepare the statement + execute with bound values
        $sth = static::$app->db->prepare($update->getStatement());
        $sth->execute($update->getBindValues());

        return $this->id;
    }

    public function cleanPagePreview()
    {
        return str_replace(' ', '%20', $this->preview_image);
    }

    public function toArray()
    {
        return [
            'id' => (int) $this->id,
            'title' => $this->title,
            'uri' => $this->uri,
            'article' => $this->article,
            'preview_image' => $this->preview_image,
            'category' => $this->category,
            'meta_title' => ! empty($this->meta_title) ? $this->meta_title : $this->title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'post_date' => $this->post_date,
            'updated_date' => $this->updated_date,
            'author_id' => $this->author_id,
            'status' => $this->status,
            // Appends:
            'reading_time' => $this->getReadingTime(),
        ];
    }

    public function isPublished()
    {
        return ($this->status === 1);
    }

    public static function findMostRecent($limit = 3)
    {
        $query = static::$app->query->newSelect();
        $query->cols(['*'])
              ->from('pages')
              ->where('status=1')
              ->orderBy(['post_date desc'])
              ->limit($limit);

        $pages = [];
        $res = static::$app->db->fetchAll($query);
        foreach ($res as $page) {
            $pages []= new Page($page);
        }

        return $pages;
    }

    public static function findByPageName($pageName)
    {
        $query = static::$app->query->newSelect();
        $query->cols(['*'])
              ->from('pages')
              ->where('status=1')
              ->where('uri="'.$pageName.'"');

        $result = static::$app->db->fetchOne($query);
        if (! $result) {
            return null;
        }

        return new Page($result);
    }

    public static function findById($pageId)
    {
        $query = static::$app->query->newSelect();
        $query->cols(['*'])
              ->from('pages')
              ->where('id='.$pageId);

        $result = static::$app->db->fetchOne($query);
        if (! $result) {
            return null;
        }

        return new Page($result);
    }

    public static function findAll($activeOnly = false, $toArray = true)
    {
        $query = static::$app->query->newSelect();
        $query->cols(['*'])->from('pages');

        if ($activeOnly) {
            $query->where('status=1');
        }

        $query->orderBy(['if(updated_date, updated_date, post_date) desc']);

        $pages = [];
        $res = static::$app->db->fetchAll($query);
        foreach ($res as $page) {
            $pages []= $toArray ? (new Page($page))->toArray() : new Page($page);
        }

        return $pages;
    }

    public static function findAllActive($toArray = false)
    {
        return static::findAll(true, $toArray);
    }

    public static function findActiveByCategory($category)
    {
        $query = static::$app->query->newSelect();
        $query->cols(['*'])
              ->from('pages')
              ->where('status=1')
              ->where('category LIKE "'. $category .'"')
              ->orderBy(['post_date desc'])
              ->limit(100);

        $pages = [];
        $res = static::$app->db->fetchAll($query);
        foreach ($res as $page) {
            $pages []= new Page($page);
        }

        return $pages;
    }

    public static function findBySearchTerm($term)
    {
        if (empty($term)) return [];

        $query = static::$app->query->newSelect();
        $query->cols(['*'])
              ->from('pages')
              ->where('status=1')
              ->where('(
                        title LIKE "%'.$term.'%" OR
                        article LIKE "%'.$term.'%" OR
                        uri LIKE "%'.$term.'%" OR
                        meta_keywords LIKE "%'.$term.'%"
                       )')
              ->orderBy(['post_date desc']);

        $pages = [];
        $res = static::$app->db->fetchAll($query);
        foreach ($res as $page) {
            $pages []= (new Page($page))->toArray();
        }

        return $pages;
    }

    public function getReadingTime()
    {
        if (! is_null($this->readingTime)) {
            return $this->readingTime;
        }

        $avgAdultWPM = 275;
        $wordCount   = str_word_count(strip_tags($this->article));
        $numMins     = ($wordCount / $avgAdultWPM);
        // Add 12 seconds for each image:
        $numImages   = substr_count($this->article, '<img');
        $numSeconds  = ($numMins*60) + ($numImages * 12);
        $this->readingTime = round(($numSeconds / 60));

        return $this->readingTime;
    }
}