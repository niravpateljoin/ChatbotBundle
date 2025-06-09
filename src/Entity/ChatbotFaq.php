<?php
namespace Chatbot\Entity;

use Doctrine\ORM\Mapping as ORM;
use Chatbot\Repository\ChatbotFaqRepository;

#[ORM\Entity(repositoryClass: ChatbotFaqRepository::class)]
class ChatbotFaq
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string')]
    private string $question;

    #[ORM\Column(type: 'text')]
    private string $answer;

    #[ORM\ManyToOne(targetEntity: ChatbotCategory::class, inversedBy: 'faqs')]
    #[ORM\JoinColumn(nullable: false)]
    private ChatbotCategory $category;

    public function getId(): int { return $this->id; }

    public function getQuestion(): string { return $this->question; }

    public function setQuestion(string $question): self
    {
        $this->question = $question;
        return $this;
    }

    public function getAnswer(): string { return $this->answer; }

    public function setAnswer(string $answer): self
    {
        $this->answer = $answer;
        return $this;
    }

    public function getCategory(): ChatbotCategory
    {
        return $this->category;
    }

    public function setCategory(ChatbotCategory $category): self
    {
        $this->category = $category;
        return $this;
    }
}
