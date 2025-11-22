using AutoMapper;
using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Models;
namespace ProjetoSkillUp.Infrastructure.AutoMapper;
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Module -> ModuleDto
        CreateMap<Module, CompleteModuleDto>();

        // ModuleDto -> Module
        CreateMap<CompleteModuleDto, Module>();

        // Quiz -> QuizDto
        CreateMap<Quiz, CreateQuizDto>();

        // QuizQuestion -> QuizQuestionDto
        CreateMap<Quiz_Questions, CreateQuestionDto>()
            .ForMember(dest => dest.Options,
                       opt => opt.MapFrom(src => src.Options));

        // QuizWithQuestionsDto
        CreateMap<Quiz, QuizWithQuestionsDto>()
            .ForMember(dest => dest.Questions,
                       opt => opt.MapFrom(src => src.Questions));
    }
}
