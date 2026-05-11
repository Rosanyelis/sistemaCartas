<?php

namespace App\Policies;

use App\Policies\Concerns\GrantsAllAbilitiesToAdmins;

class StoreOrderPolicy
{
    use GrantsAllAbilitiesToAdmins;
}
