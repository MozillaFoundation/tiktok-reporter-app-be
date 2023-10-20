import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from 'src/policies/entities/policy.entity';
import { PolicyType } from 'src/models/policyType';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { Study } from 'src/studies/entities/study.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CountryCode,
      Policy,
      Onboarding,
      OnboardingStep,
      Study,
    ]),
  ],
})
export class SeedersModule {
  constructor(
    @InjectRepository(CountryCode)
    private readonly countryCodeRepository: Repository<CountryCode>,
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
    @InjectRepository(OnboardingStep)
    private readonly onboardingStepRepository: Repository<OnboardingStep>,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
  ) {}

  async onModuleInit() {
    try {
      // TODO: Verify the validity of these country codes
      await this.seedCountryCodes();
      // TODO: This is only test data
      await this.seedPolicies();
      const onboarding = await this.seedOnboardings();
      await this.seedStudies(onboarding);
    } catch (error) {
      console.error('Something went wrong while seeding', error.message);
    }
  }

  async seedCountryCodes() {
    const countryCodeCount = await this.countryCodeRepository.count();
    if (countryCodeCount > 0) {
      return;
    }

    for (let i = 0; i < availableCountryCodes.length; i++) {
      const availableCountryCode = availableCountryCodes[i];
      await this.countryCodeRepository.save({
        countryName: availableCountryCode.countryName,
        code: availableCountryCode.countryCode,
      });
    }
  }

  async seedPolicies() {
    const countryCodeCount = await this.policyRepository.count();
    if (countryCodeCount > 0) {
      return;
    }

    this.policyRepository.save({
      type: PolicyType.TermsOfService,
      title: ' Terms of Service Title',
      subtitle: ' Terms of Service Sub Title',
      text: policyText,
    });

    this.policyRepository.save({
      type: PolicyType.PrivacyPolicy,
      title: ' Terms of Service Title',
      subtitle: ' Terms of Service Sub Title',
      text: policyText,
    });
  }

  async seedOnboardings() {
    const onboardingsCount = await this.onboardingRepository.count();
    if (onboardingsCount > 0) {
      return;
    }

    const newOnboarding = await this.onboardingRepository.create({
      name: 'TEST Onboarding step',
      steps: [],
    });

    for (let i = 0; i < onboardingSteps.length; i++) {
      const onboardingStep = onboardingSteps[i];
      const createdOnboardingStep = await this.onboardingStepRepository.create({
        title: onboardingStep.title,
        description: onboardingStep.description,
        imageUrl: onboardingStep.imageUrl,
        details: onboardingStep.details,
        order: onboardingStep.order,
      });
      const savedOnboardingStep = await this.onboardingStepRepository.save(
        createdOnboardingStep,
      );
      newOnboarding.steps.push(savedOnboardingStep);
    }
    return await this.onboardingRepository.save(newOnboarding);
  }

  async seedStudies(onboarding: Onboarding) {
    const countryCodeCount = await this.studyRepository.count();
    if (countryCodeCount > 0) {
      return;
    }

    const studyPolicy = await this.policyRepository.save({
      type: PolicyType.TermsOfService,
      title: 'Custom Terms of Service for this study',
      subtitle: ' Custom Terms of Service for this study',
      text: policyText,
    });
    const countryCodes = await this.countryCodeRepository.find({
      where: { code: 'ro' },
    });

    return await this.studyRepository.save({
      name: 'Custom Study for testing only',
      description: 'Custom Study for testing only',
      countryCodes,
      onboarding,
      policies: [studyPolicy],
    });
  }
}

const onboardingSteps = [
  {
    title: 'OnboardingStep title',
    description: 'Onboarding step description',
    details: 'Onboarding step details',
    order: 1,
    imageUrl:
      'https://storage.cloud.google.com/regrets_reporter_onboarding_docs/Onboarding%20image%20-%20recording%20-%20step%201.png',
  },
  {
    title: 'OnboardingStep title',
    description: 'Onboarding step description',
    details: 'Onboarding step details',
    order: 2,
    imageUrl:
      'https://storage.cloud.google.com/regrets_reporter_onboarding_docs/Onboarding%20image%20-%20recording%20-%20step%202.png',
  },
  {
    title: 'OnboardingStep title',
    description: 'Onboarding step description',
    details: 'Onboarding step details',
    order: 3,
    imageUrl:
      'https://storage.cloud.google.com/regrets_reporter_onboarding_docs/Onboarding%20image%20-%20recording%20-%20step%203.png',
  },
  {
    title: 'OnboardingStep title',
    description: 'Onboarding step description',
    details: 'Onboarding step details',
    order: 4,
    imageUrl:
      'https://storage.cloud.google.com/regrets_reporter_onboarding_docs/Onboarding%20image%20-%20report%20link%20-%20step%201.png',
  },
  {
    title: 'OnboardingStep title',
    description: 'Onboarding step description',
    details: 'Onboarding step details',
    order: 5,
    imageUrl:
      'https://storage.cloud.google.com/regrets_reporter_onboarding_docs/Onboarding%20image%20-%20report%20link%20-%20step%202.png',
  },
  {
    title: 'OnboardingStep title',
    description: 'Onboarding step description',
    details: 'Onboarding step details',
    order: 6,
    imageUrl:
      'https://storage.cloud.google.com/regrets_reporter_onboarding_docs/Onboarding%20image%20-%20report%20link%20-%20step%203.png',
  },
];

const policyText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris egestas risus augue, ut egestas tortor ultrices vitae. Curabitur malesuada scelerisque rhoncus. Suspendisse vitae commodo metus. Phasellus et bibendum elit, eu auctor tortor. Vivamus pharetra, tellus ac sollicitudin ultrices, lorem lacus dapibus nisi, et dapibus tortor lectus at metus. Sed in maximus urna, tempus ultricies magna. Nam vitae turpis consectetur, pretium metus ut, convallis mi. Vestibulum vestibulum ex at mi faucibus malesuada. Etiam ullamcorper in tortor quis pellentesque. Fusce tristique nunc risus, nec vestibulum dui suscipit eget.

In accumsan ante orci, non fringilla sem blandit at. Nulla sollicitudin cursus aliquet. Pellentesque quis vestibulum nulla. Vivamus blandit sem ut sapien tristique bibendum. Pellentesque fermentum scelerisque pretium. Donec placerat maximus bibendum. In in ultricies purus, ut tempus leo. Pellentesque tempor, justo vel elementum scelerisque, elit sem dapibus enim, porttitor pharetra urna arcu non nibh. In eget risus eleifend, accumsan leo sit amet, maximus lorem. Maecenas quis volutpat tellus. Quisque egestas semper tincidunt. In condimentum elementum bibendum. Donec congue tortor vitae justo tempor, vitae suscipit sem efficitur. Nulla nec euismod orci. In posuere fringilla iaculis. Maecenas posuere, nisl et tincidunt semper, sapien neque porttitor est, ac mollis dolor lorem consectetur urna.

Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque lacinia, dolor id aliquet ornare, diam lectus ornare leo, in pellentesque turpis massa eget magna. Aliquam tortor libero, ultricies non nisi quis, finibus semper velit. Morbi elementum, sapien a efficitur auctor, dolor mi pharetra urna, sed gravida purus orci et dui. Vestibulum eu ultrices neque. Aenean congue, massa a rutrum lacinia, elit turpis imperdiet ipsum, quis mollis dui ligula et lorem. Vestibulum ac elementum neque.

Morbi cursus mattis egestas. Sed vehicula placerat mauris, sed elementum mi viverra et. Nulla feugiat orci elit, in bibendum sapien fringilla ac. Etiam in luctus nibh, sed elementum nisl. Cras quis turpis consectetur nibh euismod sodales. Sed dolor lacus, lobortis porttitor malesuada ac, volutpat a ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur lacinia velit odio, vitae blandit nulla commodo ut. Sed dapibus pulvinar tellus, eu bibendum diam aliquet fermentum. Fusce semper gravida dapibus. Duis non porta quam, ac porttitor velit. Sed faucibus in arcu at porttitor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam eu rutrum eros, eget finibus lectus. Proin pretium porta iaculis.

Cras feugiat odio tristique, blandit sapien quis, lobortis augue. In libero erat, congue quis volutpat a, vulputate id nisi. Phasellus tincidunt egestas consequat. Donec quis consectetur mi. Aenean tristique leo id lacinia faucibus. Morbi suscipit ligula velit, quis ornare diam bibendum eu. Fusce ut justo varius, consequat tortor in, consectetur augue. Integer placerat dolor ex, ut aliquam nulla rhoncus nec. Nam congue cursus dictum.

Etiam massa lorem, gravida finibus justo eu, dignissim viverra augue. Praesent eleifend turpis erat, sit amet accumsan enim porttitor vitae. Praesent luctus ligula vel mauris varius luctus. Maecenas justo est, tristique eget dapibus non, malesuada sed urna. Ut vel lorem sed orci placerat mollis vel viverra dolor. Sed suscipit tortor arcu, at consectetur nisi tempus quis. Maecenas in nulla sit amet ex ultrices gravida vitae vitae ex. Mauris nec blandit ligula. Donec iaculis viverra erat, sit amet consequat ante mollis id. Nunc consequat lacinia nulla a porttitor. Integer tristique non massa in porttitor. Fusce et aliquam lacus, vitae viverra ligula. In blandit dapibus egestas. Aliquam rhoncus non odio eget bibendum. Integer vitae nulla vitae eros bibendum sollicitudin.

Maecenas pellentesque, leo ut semper faucibus, justo libero pretium purus, ullamcorper rhoncus massa massa et eros. Mauris lorem augue, semper a fringilla ac, pharetra vel dolor. Aliquam ut mi et ligula luctus viverra suscipit in metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed tristique ipsum. Donec at elementum neque. Nunc at commodo libero. Nunc tempus placerat nisl eget euismod. Ut in eros nec libero iaculis pellentesque at at elit. Etiam mollis enim vel pellentesque facilisis. Donec id gravida odio, id rutrum urna. Mauris volutpat hendrerit nibh quis vehicula. Quisque maximus ullamcorper mi, euismod feugiat diam commodo et. Suspendisse sit amet lacus id metus pellentesque vehicula.

Integer ornare et ligula sed eleifend. Proin bibendum odio quam, et sodales mi rutrum eu. Suspendisse potenti. Pellentesque non venenatis enim. Phasellus tincidunt massa ipsum, at scelerisque leo egestas in. Quisque id ligula tincidunt est aliquet tincidunt. Proin eget viverra massa, in fringilla magna. Sed congue consequat nunc, id iaculis nunc egestas in. Sed id efficitur elit. Morbi a elementum ante. Praesent consectetur velit cursus, vehicula quam ut, luctus metus. Nunc sit amet urna lobortis, pharetra quam id, consequat justo. In elementum volutpat convallis.

Morbi sapien arcu, sodales in risus ac, mollis venenatis odio. Duis mi massa, rutrum et sagittis a, scelerisque sed mauris. Curabitur arcu mi, molestie non libero a, interdum hendrerit est. Nunc ultrices in dolor et tincidunt. Nullam enim mauris, sagittis vel massa ut, viverra congue justo. Sed odio nisl, tristique non bibendum pellentesque, feugiat imperdiet augue. Vivamus nec lorem consectetur, feugiat nibh ac, viverra ante. Mauris faucibus, odio eu varius porta, lacus ante egestas dolor, ut ultricies mi risus eget elit. In arcu ante, ultricies iaculis nulla id, mollis bibendum quam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer tristique ligula sit amet nunc egestas finibus. Fusce pretium augue quis nunc condimentum, eget auctor urna efficitur. Aliquam erat volutpat. Maecenas lacinia lectus sapien, posuere tempor ipsum dapibus ut.

In pellentesque maximus vehicula. Donec placerat velit tortor. Nam hendrerit finibus ante ac congue. Vestibulum imperdiet tortor in bibendum interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam nec blandit nisl. In tincidunt justo neque, id dignissim mi cursus vestibulum. Sed justo nibh, mattis id tortor eget, scelerisque feugiat nunc. Sed blandit odio eu faucibus tempus. Proin non odio vehicula, congue est efficitur, rhoncus orci. In sit amet condimentum justo, at sollicitudin massa.

Maecenas convallis mollis quam, vel ornare ante posuere ut. Duis vulputate lobortis lectus vitae aliquet. Aenean in ornare est. Praesent sed metus mattis, fringilla ipsum non, commodo arcu. Cras porta ante quis nulla placerat lacinia. Donec vulputate commodo ligula id pretium. Donec vulputate vel felis a commodo. Fusce lacinia purus sed dolor fermentum auctor. Suspendisse euismod eros eget nunc porttitor suscipit. Sed fermentum aliquam tempor. Donec porttitor, magna vel tempus finibus, leo lorem euismod est, porta rhoncus quam arcu vel justo.

Quisque imperdiet tellus eget leo hendrerit vestibulum. Ut lacinia accumsan turpis at volutpat. Pellentesque mollis dapibus lorem sit amet semper. Phasellus non varius arcu. Aenean eu semper lacus, non dapibus orci. Proin fermentum augue ut tellus tempus dignissim. Ut fermentum consequat velit. Morbi leo diam, ullamcorper ac blandit id, vulputate at magna. Aliquam ut enim est. Quisque facilisis maximus odio, sed vestibulum urna rutrum ac. Duis pretium nisl sapien, a interdum dui fermentum nec. Mauris varius arcu ut dolor maximus scelerisque. Nulla facilisi. Nunc non dictum lacus.

Curabitur vel neque et eros ornare porttitor at quis dolor. Mauris a dapibus justo. Ut a massa a nulla condimentum facilisis. Etiam eu iaculis massa. Integer ut enim massa. Cras venenatis ultrices fringilla. Curabitur non lorem accumsan, fringilla libero sit amet, rutrum felis. Proin lorem ante, scelerisque a mattis et, mattis malesuada tortor.

Sed blandit pharetra consequat. Donec quis magna auctor, tristique lorem sit amet, semper massa. Donec in elementum risus. Sed aliquam, neque ac elementum lacinia, arcu felis faucibus metus, quis feugiat dolor felis a erat. Cras et erat consequat dui dignissim viverra. Mauris finibus, justo nec mattis sagittis, purus magna mattis sem, eu mollis odio odio ut est. Vestibulum nec neque sagittis felis auctor fringilla. In tortor orci, varius vel malesuada eget, tincidunt tincidunt elit. In eleifend tempus mi. Pellentesque nisi augue, posuere id neque nec, aliquam lacinia ante.

Praesent sed massa eu urna auctor elementum ut fermentum tellus. Nullam sed lectus blandit, placerat leo et, faucibus tortor. Vestibulum id eleifend justo. Donec dapibus enim ut lectus ullamcorper laoreet. Aliquam cursus lorem id bibendum blandit. Donec congue aliquet urna quis ullamcorper. Praesent mattis, purus sit amet accumsan vulputate, erat tellus maximus tortor, pharetra tincidunt tortor arcu eu ex. Integer feugiat, justo ac ullamcorper sollicitudin, nibh justo sagittis libero, ac rutrum nisl eros mollis velit. Maecenas posuere lorem ac arcu maximus elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras id nulla ligula.
`;

const availableCountryCodes = [
  { countryName: 'Afghanistan', countryCode: 'af' },
  { countryName: 'Algeria', countryCode: 'dz' },
  { countryName: 'Angola', countryCode: 'ao' },
  { countryName: 'Argentina', countryCode: 'ar' },
  { countryName: 'Australia', countryCode: 'au' },
  { countryName: 'Austria', countryCode: 'at' },
  { countryName: 'Bangladesh', countryCode: 'bd' },
  { countryName: 'Belarus', countryCode: 'by' },
  { countryName: 'Belgium', countryCode: 'be' },
  { countryName: 'Bolivia', countryCode: 'bo' },
  { countryName: 'Bosnia And Herzegovina', countryCode: 'ba' },
  { countryName: 'Botswana', countryCode: 'bw' },
  { countryName: 'Brazil', countryCode: 'br' },
  { countryName: 'Bulgaria', countryCode: 'bg' },
  { countryName: 'Cambodia', countryCode: 'kh' },
  { countryName: 'Cameroon', countryCode: 'cm' },
  { countryName: 'Canada', countryCode: 'ca' },
  { countryName: 'Chile', countryCode: 'cl' },
  { countryName: 'China', countryCode: 'cn' },
  { countryName: 'Colombia', countryCode: 'co' },
  { countryName: 'Congo, The Democratic Republic Of The', countryCode: 'cd' },
  { countryName: 'Costa Rica', countryCode: 'cr' },
  { countryName: "Cote D'ivoire", countryCode: 'ci' },
  { countryName: 'Croatia', countryCode: 'hr' },
  { countryName: 'Cyprus', countryCode: 'cy' },
  { countryName: 'Czech Republic', countryCode: 'cz' },
  { countryName: 'Denmark', countryCode: 'dk' },
  { countryName: 'Dominican Republic', countryCode: 'do' },
  { countryName: 'Ecuador', countryCode: 'ec' },
  { countryName: 'Egypt', countryCode: 'eg' },
  { countryName: 'El Salvador', countryCode: 'sv' },
  { countryName: 'Estonia', countryCode: 'ee' },
  { countryName: 'Finland', countryCode: 'fi' },
  { countryName: 'France', countryCode: 'fr' },
  { countryName: 'Gabon', countryCode: 'ga' },
  { countryName: 'Georgia', countryCode: 'ge' },
  { countryName: 'Germany', countryCode: 'de' },
  { countryName: 'Greece', countryCode: 'gr' },
  { countryName: 'Guatemala', countryCode: 'gt' },
  { countryName: 'Honduras', countryCode: 'hn' },
  { countryName: 'Hong Kong', countryCode: 'hk' },
  { countryName: 'Hungary', countryCode: 'hu' },
  { countryName: 'Iceland', countryCode: 'is' },
  { countryName: 'India', countryCode: 'in' },
  { countryName: 'Indonesia', countryCode: 'id' },
  { countryName: 'Iran, Islamic Republic Of', countryCode: 'ir' },
  { countryName: 'Iraq', countryCode: 'iq' },
  { countryName: 'Ireland', countryCode: 'ie' },
  { countryName: 'Israel', countryCode: 'il' },
  { countryName: 'Italy', countryCode: 'it' },
  { countryName: 'Japan', countryCode: 'jp' },
  { countryName: 'Jordan', countryCode: 'jo' },
  { countryName: 'Kazakstan', countryCode: 'kz' },
  { countryName: 'Kenya', countryCode: 'ke' },
  { countryName: 'Korea, Republic Of', countryCode: 'kr' },
  { countryName: 'Kuwait', countryCode: 'kw' },
  { countryName: "Lao People's Democratic Republic", countryCode: 'la' },
  { countryName: 'Latvia', countryCode: 'lv' },
  { countryName: 'Lebanon', countryCode: 'lb' },
  { countryName: 'Libyan Arab Jamahiriya', countryCode: 'ly' },
  { countryName: 'Lithuania', countryCode: 'lt' },
  { countryName: 'Luxembourg', countryCode: 'lu' },
  { countryName: 'Macau', countryCode: 'mo' },
  { countryName: 'Malawi', countryCode: 'mw' },
  { countryName: 'Malaysia', countryCode: 'my' },
  { countryName: 'Maldives', countryCode: 'mv' },
  { countryName: 'Mexico', countryCode: 'mx' },
  { countryName: 'Montenegro', countryCode: 'me' },
  { countryName: 'Morocco', countryCode: 'ma' },
  { countryName: 'Myanmar', countryCode: 'mm' },
  { countryName: 'Nauru', countryCode: 'nr' },
  { countryName: 'Netherlands', countryCode: 'nl' },
  { countryName: 'New Zealand', countryCode: 'nz' },
  { countryName: 'Nicaragua', countryCode: 'ni' },
  { countryName: 'Nigeria', countryCode: 'ng' },
  { countryName: 'Norway', countryCode: 'no' },
  { countryName: 'Oman', countryCode: 'om' },
  { countryName: 'Pakistan', countryCode: 'pk' },
  { countryName: 'Panama', countryCode: 'pa' },
  { countryName: 'Paraguay', countryCode: 'py' },
  { countryName: 'Peru', countryCode: 'pe' },
  { countryName: 'Philippines', countryCode: 'ph' },
  { countryName: 'Poland', countryCode: 'pl' },
  { countryName: 'Portugal', countryCode: 'pt' },
  { countryName: 'Qatar', countryCode: 'qa' },
  { countryName: 'Romania', countryCode: 'ro' },
  { countryName: 'Russian Federation', countryCode: 'ru' },
  { countryName: 'Rwanda', countryCode: 'rw' },
  { countryName: 'Saudi Arabia', countryCode: 'sa' },
  { countryName: 'Senegal', countryCode: 'sn' },
  { countryName: 'Serbia', countryCode: 'rs' },
  { countryName: 'Singapore', countryCode: 'sg' },
  { countryName: 'Slovakia', countryCode: 'sk' },
  { countryName: 'Slovenia', countryCode: 'si' },
  { countryName: 'South Africa', countryCode: 'za' },
  { countryName: 'Spain', countryCode: 'es' },
  { countryName: 'Sri', countryCode: 'lk' },
  { countryName: 'Sweden', countryCode: 'se' },
  { countryName: 'Switzerland', countryCode: 'ch' },
  { countryName: 'Taiwan, Province Of China', countryCode: 'tw' },
  { countryName: 'Tanzania', countryCode: 'tz' },
  { countryName: 'Thailand', countryCode: 'th' },
  { countryName: 'The Republic of Kosovo', countryCode: 'xk' },
  { countryName: 'Tonga', countryCode: 'to' },
  { countryName: 'Tunisia', countryCode: 'tn' },
  { countryName: 'Turkey', countryCode: 'tr' },
  { countryName: 'Uganda', countryCode: 'ug' },
  { countryName: 'Ukraine', countryCode: 'ua' },
  { countryName: 'United Arab Emirates', countryCode: 'ae' },
  { countryName: 'United Kingdom', countryCode: 'gb' },
  { countryName: 'United States', countryCode: 'us' },
  { countryName: 'Uruguay', countryCode: 'uy' },
  { countryName: 'Vanuatu', countryCode: 'vu' },
  { countryName: 'Venezuela', countryCode: 've' },
  { countryName: 'Viet Nam', countryCode: 'vn' },
  { countryName: 'Zambia', countryCode: 'zm' },
  { countryName: 'Zimbabwe', countryCode: 'zw' },
];
