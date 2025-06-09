<?php

namespace Chatbot\Security;

use Doctrine\Common\Collections\Collection;

interface ChatbotUserInterface
{
    /**
     * Returns the unique ID of the user.
     */
    public function getQuestions(): Collection;
}
