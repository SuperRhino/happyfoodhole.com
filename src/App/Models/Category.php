<?php
namespace App\Models;

use Core\Database\Model;

class Category extends Model {

    public static function findAllActive()
    {
        $query = static::$app->query->newSelect();
        $query->cols(['category', 'MAX(updated_date) as lastmod'])
              ->from('pages')
              ->where('status=1')
              ->where('category <> ""')
              ->groupBy(['category']);

        $categories = [];
        $res = static::$app->db->fetchAll($query);
        foreach ($res as $cat) {
            $categories []= $cat;
        }

        return $categories;
    }
}