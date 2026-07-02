<?php

namespace App\Policies;

use App\Policies\Concerns\GrantsAllAbilitiesToAdmins;

class AudioPolicy
{
    use GrantsAllAbilitiesToAdmins;
}
