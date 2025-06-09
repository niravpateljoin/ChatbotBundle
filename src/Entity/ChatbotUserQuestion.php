<?php
// src/Entity/ChatbotUserQuestion.php

namespace Chatbot\Entity;

use Chatbot\Security\ChatbotUserInterface;
use Doctrine\ORM\Mapping as ORM;

#[ORM\MappedSuperclass]
abstract class ChatbotUserQuestion
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "text")]
    private ?string $questionText = null;
    #[ORM\Column(type: "datetime")]
    private \DateTimeInterface $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestionText(): ?string
    {
        return $this->questionText;
    }

    public function setQuestionText(string $questionText): self
    {
        $this->questionText = $questionText;
        return $this;
    }

    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    // Abstract methods to be implemented by concrete class
    abstract public function getUser(): ChatbotUserInterface;
    abstract public function setUser(ChatbotUserInterface $user): static;
}
