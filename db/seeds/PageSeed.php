<?php

use Phinx\Seed\AbstractSeed;

class PageSeed extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * http://docs.phinx.org/en/latest/seeding.html
     */
    public function run()
    {
        // inserting multiple rows
        $pages = [
            [
              'id'    => 1,
              'title'  => 'Heading',
              'meta_description' => 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.',
              'post_date' => '2014-09-01 00:00:00',
              'status' => 1,
            ],
            [
              'id'    => 2,
              'title'  => 'Heading Two',
              'meta_description' => 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Donec id elit non mi porta gravida at eget metus. Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod.',
              'uri' => '#',
              'post_date' => '2014-10-01 00:00:00',
              'status' => 1,
            ],
            [
              'id'    => 3,
              'title'  => 'Heading Three',
              'meta_description' => 'Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
              'post_date' => '2014-09-01 00:00:00',
              'status' => 1,
            ]
        ];

        // this is a handy shortcut
        $this->insert('pages', $pages);
    }
}
